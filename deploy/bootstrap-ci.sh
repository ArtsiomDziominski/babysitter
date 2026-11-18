#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "$EUID" -ne 0 ]]; then
  echo "Run this script as root" >&2
  exit 1
fi

deploy_public_key="${1:-}"
if [[ ! "$deploy_public_key" =~ ^ssh-ed25519[[:space:]]+[A-Za-z0-9+/]+={0,2}[[:space:]]+ ]]; then
  echo "Pass the CI deploy user's ssh-ed25519 public key as the first argument" >&2
  exit 2
fi

arch="$(uname -m)"
case "$arch" in
  x86_64) node_arch=x64 ;;
  aarch64|arm64) node_arch=arm64 ;;
  *) echo "Unsupported server architecture: $arch" >&2; exit 3 ;;
esac

node_version=24.22.3
node_dir="/opt/node-v${node_version}-linux-${node_arch}"
if [[ ! -x "$node_dir/bin/node" ]]; then
  archive="/tmp/node-v${node_version}-linux-${node_arch}.tar.xz"
  curl --fail --location --silent --show-error \
    "https://nodejs.org/dist/v${node_version}/node-v${node_version}-linux-${node_arch}.tar.xz" \
    --output "$archive"
  install -d -m 755 /opt
  tar -xJf "$archive" -C /opt
  rm -f "$archive"
fi

if ! id babysitter-deploy >/dev/null 2>&1; then
  useradd --system --create-home --home-dir /home/babysitter-deploy \
    --shell /bin/bash --gid www-data babysitter-deploy
else
  usermod --shell /bin/bash --gid www-data babysitter-deploy
fi

base=/var/www/babysitter-ci
install -d -o root -g www-data -m 2750 "$base" "$base/releases"
install -d -o babysitter-deploy -g www-data -m 2750 "$base/incoming"

install -d -o root -g root -m 755 /home/babysitter-deploy/.ssh
chown babysitter-deploy:www-data /home/babysitter-deploy/.ssh
chmod 700 /home/babysitter-deploy/.ssh
printf 'restrict %s\n' "$deploy_public_key" > /home/babysitter-deploy/.ssh/authorized_keys
chown babysitter-deploy:www-data /home/babysitter-deploy/.ssh/authorized_keys
chmod 600 /home/babysitter-deploy/.ssh/authorized_keys

cat > /etc/systemd/system/babysitter.service <<EOF
[Unit]
Description=Babysitter Nuxt frontend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/babysitter-ci/current
EnvironmentFile=/etc/babysitter.env
ExecStart=${node_dir}/bin/node .output/server/index.mjs
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

cat > /usr/local/sbin/babysitter-deploy <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail

release_id="${1:-}"
if [[ ! "$release_id" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Expected a full Git commit SHA" >&2
  exit 2
fi

base=/var/www/babysitter-ci
incoming="$base/incoming/$release_id"
archive="$incoming/release.tar.gz"
new_env="$incoming/babysitter.env"
release="$base/releases/$release_id"
current="$base/current"
env_file=/etc/babysitter.env

[[ -s "$archive" && -s "$new_env" ]] || { echo "Release archive or runtime env is missing" >&2; exit 1; }
tar -tzf "$archive" | grep -q '^.output/server/index.mjs$' || { echo "Archive does not contain the Nuxt server entrypoint" >&2; exit 1; }

previous=""
if [[ -L "$current" ]]; then previous="$(readlink -f "$current" || true)"; fi
env_backup="$(mktemp)"
had_env=false
if [[ -f "$env_file" ]]; then cp -p "$env_file" "$env_backup"; had_env=true; fi

rollback() {
  if [[ -n "$previous" ]]; then
    ln -sfn "$previous" "$base/current.rollback"
    mv -Tf "$base/current.rollback" "$current"
  fi
  if [[ "$had_env" == true ]]; then install -o root -g www-data -m 640 "$env_backup" "$env_file"; else rm -f "$env_file"; fi
  systemctl restart babysitter.service || true
}

rm -rf -- "$release"
install -d -o www-data -g www-data -m 2750 "$release"
tar --no-same-owner -xzf "$archive" -C "$release"
chown -R www-data:www-data "$release"
install -o root -g www-data -m 640 "$new_env" "$env_file"

ln -sfn "$release" "$base/current.next"
mv -Tf "$base/current.next" "$current"
systemctl daemon-reload
systemctl enable babysitter.service >/dev/null
if ! systemctl restart babysitter.service; then
  journalctl -u babysitter.service --since "2 minutes ago" --no-pager -n 80 >&2 || true
  rollback
  exit 1
fi

for attempt in $(seq 1 30); do
  if curl --fail --silent http://127.0.0.1:3001/ >/dev/null; then
    rm -rf -- "$incoming"
    rm -f "$env_backup"
    find "$base/releases" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -rn | tail -n +6 | cut -d' ' -f2- | xargs -r rm -rf --
    echo "Activated Babysitter release $release_id"
    exit 0
  fi
  sleep 2
done

journalctl -u babysitter.service --since "2 minutes ago" --no-pager -n 80 >&2 || true
rollback
rm -f "$env_backup"
echo "Babysitter did not become healthy; previous release restored" >&2
exit 1
EOF
chmod 755 /usr/local/sbin/babysitter-deploy

cat > /etc/sudoers.d/babysitter-deploy <<'EOF'
babysitter-deploy ALL=(root) NOPASSWD: /usr/local/sbin/babysitter-deploy *
EOF
chmod 440 /etc/sudoers.d/babysitter-deploy
visudo -cf /etc/sudoers.d/babysitter-deploy
systemctl daemon-reload
echo "Babysitter CI deploy account is ready"
