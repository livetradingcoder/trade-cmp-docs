# Tech Stack

LiveTradingLeague is a TypeScript monorepo (Turborepo) with two packages —
`web` (frontend) and `server` (backend) — deployed as a single container.

## Frontend (`packages/web`)

| Technology | Purpose |
|------------|---------|
| React 19 + TypeScript | UI |
| Vite 7 | Build tool & dev server |
| React Router DOM 7 | Client-side routing |
| Framer Motion | Animations |
| Lucide React | Icons |

The frontend calls the API **same-origin** (`/api/*`), so no API URL is needed in
the single-container deployment.

## Backend (`packages/server`)

| Technology | Purpose |
|------------|---------|
| Node.js 22 + TypeScript | Runtime & language |
| Express 4 | HTTP server |
| MongoDB + Mongoose 8 | Database & ODM |
| JWT (jsonwebtoken) | Admin authentication |
| bcryptjs | Password hashing |
| Multer + Cloudinary | Image upload & hosting |
| Nodemailer | Email |
| `crypto` (HMAC-SHA256) | FP Markets request signing |
| Vitest | Unit tests |

## Broker Integration Layer

A pluggable `BrokerConnector` interface (`services/brokers/`) with three
implementations — `fixture`, `simulation`, and the live **`fpmarkets`**
connector. The sync layer (`services/sync/`) turns connector output into
leaderboard rankings. See [FP Markets Sync](/guide/fp-markets-sync).

## Infrastructure

| Concern | Choice |
|---------|--------|
| Hosting | **Railway** (single container: nginx + Express) |
| Static outbound IP | Railway egress gateway (for broker whitelist) |
| Database | MongoDB Atlas |
| DNS / domain | Cloudflare (`app.livetradingleague.com`) |
| Container | Docker (`node:22-alpine`, nginx) |
| Monorepo / builds | Turborepo |
| Docs | VitePress → GitHub Pages |

See [Railway Deployment](/deployment/railway).
