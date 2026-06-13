# Environment Variables

Full reference for the server's environment variables. Locally these live in a
gitignored `.env`; in production set them on the host (e.g. the Railway service).

## Core

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` / `MONGODB_URI` | ✅ | MongoDB connection string (Atlas in prod). `MONGODB_URI` takes precedence. |
| `JWT_SECRET` | ✅ | Signs admin JWTs. Generate a strong value. |
| `ENCRYPTION_KEY` | ✅ | AES-256 key for encrypting sensitive stored data (e.g. SMTP password). Falls back to `JWT_SECRET`. |
| `NODE_ENV` | recommended | `production` in prod. |
| `PORT` | auto | Public port. Injected by the host — do **not** set on Railway. |
| `BACKEND_PORT` | auto | Internal backend port (3001). Handled by the Dockerfile. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | optional | Seed admin credentials. |

## FP Markets Integration

See [FP Markets Sync](/guide/fp-markets-sync).

| Variable | Required | Description |
|----------|----------|-------------|
| `FP_MARKETS_BASE_URL` | ✅ | API base, e.g. `https://ibbeta.fptrading.com`. |
| `FP_MARKETS_TOKEN` | ✅ | API token from the broker. |
| `FP_MARKETS_SECRET` | ✅ | Secret used for the HMAC request signature. |
| `FP_MARKETS_REBATE_ACCOUNTS` | ✅ | Comma-separated rebate/IB account number(s) you own. |
| `SYNC_ENABLED` | optional | `true` to enable the hourly scheduler. **Default off** — turn on only after the broker whitelists our IP. |
| `SYNC_INTERVAL_MINUTES` | optional | Scheduler interval (default `60`). |

## Cloudinary (image uploads)

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Cloud name |
| `CLOUDINARY_API_KEY` | API key |
| `CLOUDINARY_API_SECRET` | API secret |

## Email (SMTP — optional, also configurable via admin panel)

| Variable | Description |
|----------|-------------|
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_SECURE` | SMTP server |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP credentials |
| `EMAIL_FROM` | From header |
| `FRONTEND_URL` | Used in password-reset links |

## Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base for the web app. Leave **empty** in the single-container deployment (frontend calls same-origin `/api`). |

## Generate secrets

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Never commit `.env`. It is gitignored and must stay local / in the host's
> secret store.
