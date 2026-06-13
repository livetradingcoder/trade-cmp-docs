# Railway Deployment

LiveTradingLeague runs as a **single container** on Railway (see the repo
`Dockerfile`): nginx serves the built React frontend on `$PORT` and proxies
`/api/*` to the Express backend on `127.0.0.1:3001`. Because the frontend calls
the API same-origin, no separate API URL is needed.

This is the production target for the **FP Markets** integration — it needs a
long-running process (for the [sync scheduler](/guide/fp-markets-sync#scheduler))
and a **static outbound IP** (for the broker whitelist), neither of which
serverless hosting provides.

---

## Why not serverless

| Requirement | Serverless (e.g. Vercel) | Railway container |
|-------------|--------------------------|-------------------|
| Static outbound IP for broker whitelist | ❌ rotating IPs | ✅ egress gateway |
| Long-running hourly scheduler | ❌ functions are ephemeral | ✅ persistent process |

---

## Deploy

The repo includes `railway.toml` (Dockerfile builder, health check
`/api/health`). Deploy from GitHub (Railway dashboard → New Project → Deploy
from GitHub → branch `main`) or via the CLI:

```bash
railway up -d -y -s trade-cmp
```

### Resilience

The backend **retries** the MongoDB connection instead of exiting on failure
(`config/database.ts`). This prevents a deploy crash-loop when the DB IP allow
list isn't ready yet — the server (and its health check) stay up and connect as
soon as the network allows.

---

## Static Egress IP

Railway's default egress **rotates on redeploy**, so it can't be whitelisted.
Provision a dedicated **egress gateway** to get fixed IPs (Railway GraphQL API):

```graphql
mutation {
  egressGatewayAssociationCreate(input: {
    serviceId: "<service-id>",
    environmentId: "<environment-id>"
  }) { ipv4 region zone }
}
```

This returns a small, fixed set of IPs (HA across zones). Redeploy to route
outbound traffic through them, then give **all** of them to the broker to
whitelist.

Also disable IPv6 egress so outbound is deterministically IPv4 (the broker sits
behind Cloudflare and is dual-stack):

```graphql
mutation {
  serviceInstanceUpdate(
    serviceId: "<service-id>",
    environmentId: "<environment-id>",
    input: { ipv6EgressEnabled: false }
  )
}
```

> The Railway API base is `https://backboard.railway.app/graphql/v2` with header
> `Authorization: Bearer <RAILWAY_API_TOKEN>`.

---

## Custom Domain (Cloudflare)

Add the domain on Railway, then create the returned records in Cloudflare DNS:

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| CNAME | `app` | `<service>.up.railway.app` | **DNS only (grey)** |
| TXT | `_railway-verify.app` | `railway-verify=…` | n/a |

Keep the CNAME **DNS-only** until Railway issues the TLS cert (orange-cloud proxy
interferes with cert issuance). Railway verifies and provisions Let's Encrypt
automatically; the app then serves at `https://app.livetradingleague.com`.

The custom domain is **inbound only** — it does not change the outbound egress
IP the broker whitelists.

---

## Environment Variables

Set these on the Railway service (do **not** set `PORT`/`BACKEND_PORT` — handled
automatically). See [Environment Variables](/deployment/environment) for the full
list, including the `FP_MARKETS_*` and `SYNC_*` keys.
