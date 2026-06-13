# Server Documentation

## Entry Point
`packages/server/src/index.ts` — Express app. On boot it connects to MongoDB,
starts listening, and (unless serverless) starts the sync scheduler.

## Directory Structure

```
packages/server/src/
├── index.ts                      # Express setup & routes
├── config/
│   ├── database.ts               # MongoDB connect (retries, no crash-loop) + auto-seed
│   └── cloudinary.ts             # Image upload config
├── middleware/
│   ├── auth.ts                   # JWT generation & verification
│   └── upload.ts                 # Multer file upload
├── models/                       # Mongoose schemas — see Database Models
├── services/
│   ├── brokers/
│   │   ├── types.ts              # BrokerConnector interface
│   │   ├── index.ts              # connector registry (fixture | simulation | fpmarkets)
│   │   ├── fixtureConnector.ts
│   │   ├── simulationConnector.ts
│   │   └── fpMarketsConnector.ts # live FP Markets (HMAC-signed)
│   ├── sync/
│   │   ├── syncTournament.ts     # orchestration
│   │   ├── buildLeaderboard.ts   # pure mapping helpers
│   │   └── scheduler.ts          # gated hourly scheduler
│   └── leaderboard/
│       └── calculateLeaderboard.ts
├── utils/                        # email, encryption, smtp
└── seed.ts
```

See [Database Models](/guide/models) and [FP Markets Sync](/guide/fp-markets-sync).

## API Endpoints

### Authentication
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/admin/login` | No |
| POST | `/api/admin/forgot-password` | No |
| POST | `/api/admin/reset-password/:token` | No |
| GET | `/api/admin/verify` | Yes |
| POST | `/api/admin/change-password` | Yes |

### Tournaments
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/tournaments` / `/api/tournaments/:id` | No |
| POST | `/api/tournaments` | Yes |
| PUT | `/api/tournaments/:id` | Yes |
| DELETE | `/api/tournaments/:id` | Yes |

### Users & Participants
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/users/register` | No |
| GET | `/api/users/:id` | No |
| POST | `/api/participants/apply` | No |
| GET | `/api/participants/:tournamentId` | Yes |
| PUT | `/api/participants/:id/approve` \| `/decline` \| `/disqualify` | Yes |

### Broker Sync — FP Markets
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/admin/sync/:tournamentId` | Yes |
| GET | `/api/admin/fp-test` | Yes |
| GET | `/api/leaderboard/:tournamentId` | Yes |

### Settings / Upload / Health
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/settings` / `/api/settings/:key` | No |
| PUT | `/api/settings/:key` | Yes |
| POST | `/api/upload` | Yes |
| GET | `/api/health` | No |
| GET | `/api/egress-ip` | No (temporary bootstrap helper) |

## Sync Scheduler

`services/sync/scheduler.ts` runs every active tournament on an interval. It is
**disabled by default**; enable with `SYNC_ENABLED=true` (only after the broker
has whitelisted our IP). Interval via `SYNC_INTERVAL_MINUTES` (default 60).

## Resilience

`config/database.ts` **retries** the MongoDB connection on failure instead of
calling `process.exit(1)` — the server (and `/api/health`) stay up so the host
does not crash-loop before the DB IP allow list is ready.

## Environment Variables

See [Environment Variables](/deployment/environment) for the full reference
(core, FP Markets, Cloudinary, email, frontend).

## Security Features

- **Password hashing:** bcrypt (10 rounds)
- **Reset tokens:** SHA-256, 1-hour expiry
- **JWT:** 7-day validity
- **Encryption:** AES-256-CBC for stored secrets (e.g. SMTP password)
- **FP Markets:** per-request HMAC-SHA256 signature; static egress IP whitelist
- **File upload:** type whitelist, 5 MB limit
