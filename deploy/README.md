# Production deployment

The `Deploy Babysitter` GitHub Actions workflow builds this Nuxt app on pushes to `main` and activates it on `95.182.90.152`. Nginx serves `sitter.ge` over HTTPS and proxies to the app on `127.0.0.1:3001`; `dagment-new.com` keeps its existing service on port `3000`.

## GitHub Actions configuration

Create these repository or `production` environment values:

### Variables

- `DEPLOY_HOST`: `95.182.90.152`
- `DEPLOY_PORT`: `22`
- `DEPLOY_USER`: `babysitter-deploy`
- `DEPLOY_KNOWN_HOSTS`: verified SSH host key for `95.182.90.152`
- `API_BASE_URL`: `https://front.sitter.ge` (the workflow uses this default if omitted)
- `STRAPI_URL`: optional; leave unset until the production CMS URL is confirmed

### Secrets

- `DEPLOY_SSH_PRIVATE_KEY`: contents of `.codex_babysitter_deploy_key`
- `STRAPI_API_TOKEN`: optional CMS token

The deployment account accepts only the generated key and can run only `/usr/local/sbin/babysitter-deploy` through `sudo`. Runtime secrets are written to `/etc/babysitter.env` with restricted permissions.

## One-time server setup

Copy both `deploy/bootstrap-ci.sh` and `deploy/babysitter-deploy` to `/tmp` on the server, then run `bootstrap-ci.sh` as root with the matching public key as its first argument. The script installs a separate Node.js 24 runtime, restricted deploy account, systemd service, and narrow sudo rule. It does not change the existing Dagment service.
