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

install -o root -g root -m 755 /tmp/babysitter-deploy /usr/local/sbin/babysitter-deploy

cat > /etc/sudoers.d/babysitter-deploy <<'EOF'
babysitter-deploy ALL=(root) NOPASSWD: /usr/local/sbin/babysitter-deploy *
EOF
chmod 440 /etc/sudoers.d/babysitter-deploy
visudo -cf /etc/sudoers.d/babysitter-deploy
systemctl daemon-reload
echo "Babysitter CI deploy account is ready"
