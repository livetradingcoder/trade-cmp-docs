# Docker

The app ships as a **single container** (repo `Dockerfile`) that runs both the
frontend and backend. This same image is what Railway builds — see
[Railway Deployment](/deployment/railway).

## What's in the image

- **Build stage** (`node:22-alpine`): `npm ci` + `npm run build` for both
  packages (Vite for `web`, `tsc` for `server`).
- **Runtime stage** (`node:22-alpine` + nginx):
  - nginx serves the built React app on `$PORT` and proxies `/api/*` to the
    backend on `127.0.0.1:3001`.
  - Express backend runs on port 3001.

```
Browser ──▶ nginx (:$PORT) ──▶ /api/* ──▶ Express (:3001) ──▶ MongoDB
                     └──▶ static React app
```

## Build & run locally

```bash
docker build -t trade-cmp .
docker run -p 8080:80 --env-file .env trade-cmp
# app on http://localhost:8080
```

`$PORT` is injected by the host (Railway). Locally it defaults to `80`;
`BACKEND_PORT` is fixed at `3001` inside the container. Do not override these on
Railway.

## docker-compose (local dev)

`docker-compose.yml` is available for running the stack with a local MongoDB.
For production use Railway (long-running process + static egress IP) — see
[Railway Deployment](/deployment/railway).

## Notes

- The backend retries the MongoDB connection instead of exiting on failure, so a
  container won't crash-loop while the DB IP allow list is being set up.
- See [Environment Variables](/deployment/environment) for required config.
