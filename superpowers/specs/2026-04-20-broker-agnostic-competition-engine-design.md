# Broker-agnostic competition engine design

This document describes how you can evolve `trade-cmp` from a broker-coupled
application into a broker-agnostic competition platform. It focuses on the
first implementation slice: hourly sync, normalized internal data, an
application-owned ROI leaderboard, fixture-based testing, and simulation mode.

The current codebase already contains the right product surface for this work.
The backend exposes tournament, participant, settings, and mocked broker and
leaderboard endpoints in `packages/server/src/index.ts`. The frontend already
consumes tournament, participant, and leaderboard APIs from the admin and
public views. The missing piece is a stable internal boundary that separates
broker fetching from competition logic.

## Summary

The application must treat brokers as data providers, not as the source of
truth for competition rules or leaderboard calculations. The platform must
prefer raw broker data when it is available, and it must fall back to
broker-calculated metrics when raw data is unavailable. The application must
store only normalized internal records, not raw broker payloads.

In the first version, the platform will:

- sync active competition data hourly;
- rank participants by ROI;
- expose P&L, win rate, and trade count as secondary stats;
- support deterministic fixture replay for automated tests;
- support simulation mode for demos and exploratory QA; and
- serve leaderboards from application-owned computed results.

## Goals

This design introduces a broker-agnostic core while keeping the current product
moving.

- Let you build and test the app without waiting for a broker integration.
- Support multiple broker connectors behind one internal interface.
- Compute leaderboard results inside the app when raw data exists.
- Fall back to broker-provided metrics without changing leaderboard consumers.
- Keep normalized internal data as the only persisted source of truth.
- Support hourly sync for active competitions.
- Reuse the same normalized pipeline for fixtures, simulation, and live brokers.

## Non-goals

This first version stays intentionally small so you can ship it quickly.

- It does not introduce real-time or near real-time sync.
- It does not add a configurable tournament rules engine yet.
- It does not persist raw broker payload archives.
- It does not add CSV or manual ingest in v1.
- It does not require a multi-broker admin UI before the core services exist.

## Current state

The backend in `packages/server/src/index.ts` already contains:

- mocked broker endpoints under `/api/broker/*`;
- a mocked leaderboard endpoint under `/api/leaderboard/:tournamentId`;
- participant approval and disqualification flows;
- settings storage for affiliate code and SMTP configuration; and
- tournament lifecycle fields such as `status`, `start_date`, and `end_date`.

This means the user-facing product concepts already exist. What is missing is a
server-side service layer that owns trading data normalization, sync, and
scoring.

## Proposed architecture

The platform will use four layers.

### Broker connector layer

Each broker integration will implement a common connector contract. A connector
is responsible only for authentication, broker-specific requests, and mapping
external data into internal transfer objects.

The connector interface must support:

- account validation;
- account discovery or account detail fetches;
- balance or equity snapshot fetches;
- trade fetches when available; and
- broker metrics fetches for fallback leaderboard fields when raw data is not
  available.

Initial connector types:

- `fixture`;
- `simulation`; and
- future live broker connectors such as `fpmarkets`.

### Normalization layer

The normalization layer converts connector output into application-owned
records. All persisted trading data must use normalized schemas owned by this
application.

The normalization layer is also responsible for:

- deduplication;
- idempotent upserts;
- timestamp normalization;
- competition window filtering inputs; and
- recording sync outcomes.

### Competition engine

The competition engine computes leaderboard rows from normalized internal data.
It must prefer raw internal snapshots and trades. When raw data is unavailable,
it may consume fallback broker metrics produced by the connector.

The competition engine is responsible for:

- ROI calculation;
- P&L calculation;
- win rate calculation;
- trade count calculation;
- participant eligibility checks; and
- deterministic ranking and tie-breaks.

### Sync and cache layer

The sync layer runs scheduled jobs for active competitions. It refreshes
normalized data and recomputes leaderboard cache entries. Public and admin
leaderboard endpoints must read from computed cache, not directly from broker
responses.

## Data model

The application needs a small set of server-side models or equivalent
collection-backed services.

### BrokerIntegration

This entity stores broker type and sync capabilities.

Fields:

- `type`;
- `name`;
- `enabled`;
- `credentials` or a secure reference to credentials;
- `supports_account_validation`;
- `supports_raw_trades`;
- `supports_snapshots`;
- `supports_broker_metrics`;
- `sync_frequency`;
- `last_sync_at`; and
- `last_sync_status`.

### TradingAccount

This entity links your internal participant context to a broker account.

Fields:

- `user_id`;
- `participant_id`;
- `tournament_id`;
- `broker_integration_id`;
- `broker_account_id`;
- `broker_account_number`;
- `status`;
- `validated_at`;
- `last_synced_at`; and
- `sync_state`.

### AccountSnapshot

This entity stores balance or equity points over time.

Fields:

- `trading_account_id`;
- `captured_at`;
- `balance`;
- `equity`;
- `currency`; and
- `source`.

### Trade

This entity stores normalized executed trades when the broker provides them.

Fields:

- `trading_account_id`;
- `broker_trade_id`;
- `opened_at`;
- `closed_at`;
- `symbol`;
- `side`;
- `volume`;
- `open_price`;
- `close_price`;
- `fees`;
- `swap`;
- `net_pnl`;
- `currency`; and
- `source`.

### ComputedLeaderboardEntry

This entity stores the computed leaderboard row that the frontend reads.

Fields:

- `tournament_id`;
- `trading_account_id`;
- `participant_id`;
- `rank`;
- `roi`;
- `pnl`;
- `win_rate`;
- `trade_count`;
- `calculation_source`;
- `calculation_status`;
- `updated_at`; and
- `metadata`.

`calculation_source` will distinguish between `computed_raw` and
`broker_metrics`.

### SyncRun

This entity stores operational history for hourly sync jobs.

Fields:

- `tournament_id`;
- `broker_integration_id`;
- `started_at`;
- `finished_at`;
- `status`;
- `accounts_processed`;
- `snapshots_written`;
- `trades_written`;
- `leaderboard_entries_written`; and
- `error_summary`.

## Sync flow

Hourly sync is enough for the first version. The scheduler must process active
competitions more frequently than inactive ones only in a later iteration.

For each hourly sync run, the backend must:

1. Load active competitions.
2. Load approved participants for each competition.
3. Resolve each participant's `TradingAccount`.
4. Fetch fresh data through the configured connector.
5. Normalize and upsert snapshots and trades.
6. Compute leaderboard entries with the competition engine.
7. Persist computed leaderboard cache.
8. Record `SyncRun` results.

If a connector cannot provide raw trades or snapshots, it may return fallback
metrics. In that case, the sync flow must still write a
`ComputedLeaderboardEntry`, but it must mark the row as `broker_metrics`.

## Leaderboard calculation rules

The first scoring version must stay small and deterministic.

### Ranking rules

The competition engine must apply these rules.

- Primary ranking metric: ROI.
- Secondary display metrics: P&L, win rate, and trade count.
- Tie-break order: higher P&L, then higher win rate, then stable deterministic
  ordering such as account number or creation order.
- Eligible participants: only `approved` participants.
- Excluded participants: `declined` and `disqualified` participants.

### Calculation rules

The competition engine must calculate:

- ROI from the baseline snapshot at or just before competition start compared
  with the latest in-window snapshot;
- P&L from normalized trades when trade data exists;
- win rate from closed trades with positive versus negative outcomes; and
- trade count from normalized in-window trades.

If raw trades do not exist but the connector returns fallback broker metrics,
the engine must:

- populate ROI and secondary stats from those metrics;
- mark the row as `broker_metrics`; and
- avoid mixing computed raw stats and fallback stats in one row unless the
  rules explicitly support it later.

If data is incomplete, the engine must mark the row as `insufficient_data`
instead of inventing a ranking.

## Fixture and simulation support

The same internal pipeline must support test and demo modes.

### Fixture mode

Fixture mode provides deterministic seeded data for automated tests and local
development. The fixture connector returns stable accounts, snapshots, trades,
and optional fallback metrics from files or factories controlled by the app.

Use cases:

- unit and integration tests;
- repeatable local debugging; and
- regression coverage for ranking and sync behavior.

### Simulation mode

Simulation mode generates plausible account movement over time. It uses the
same normalized output models as live connectors, which means the app exercises
the real scoring path.

Use cases:

- demos;
- exploratory QA; and
- leaderboard behavior testing without live broker data.

## API impact

The first implementation can keep most existing routes while changing what sits
behind them.

The backend will continue to expose:

- participant application and review routes;
- leaderboard routes;
- tournament routes; and
- settings routes.

The main changes are:

- `/api/leaderboard/:tournamentId` must read from computed cache instead of a
  hardcoded mock list;
- mocked broker endpoints must become connector-backed service entry points or
  internal-only helper routes;
- the participant approval and management flow can keep its existing API shape
  while it starts referencing `TradingAccount` and sync state.

## Testing strategy

This design makes live brokers optional for development and test coverage.

### Unit tests

Add pure tests for:

- ROI calculation;
- P&L calculation;
- win rate calculation;
- trade count calculation;
- tie-break behavior; and
- disqualification handling.

### Connector contract tests

Run the same test suite against every connector implementation to verify that
each connector produces valid normalized records and fallback metrics.

### Sync integration tests

Use fixture mode to verify that hourly sync:

- writes normalized records;
- updates leaderboard cache;
- records sync outcomes; and
- handles partial failure cleanly.

### Simulation tests

Use simulation mode for smoke coverage and manual QA of leaderboard changes
over time.

## Rollout plan

This repo can adopt the new design incrementally.

### Phase 1: service extraction

Extract service modules from `packages/server/src/index.ts` for:

- connector contracts;
- normalization;
- competition scoring; and
- sync orchestration.

Keep existing routes, but move business logic behind those services.

### Phase 2: computed leaderboard

Replace the mocked leaderboard implementation with application-owned computed
entries backed by normalized data.

### Phase 3: non-broker development modes

Add:

- a `fixture` connector; and
- a `simulation` connector.

This phase gives you end-to-end development and testing without live broker
access.

### Phase 4: live broker integration

Implement real broker connectors behind the contract without changing
leaderboard consumers or competition logic.

## Risks and mitigations

This design reduces broker coupling, but it introduces a few risks that you
must manage.

- Data gaps can block rankings.
  Mitigation: mark rows as `insufficient_data` and keep sync status visible.
- Broker capability differences can create inconsistent fields.
  Mitigation: keep the connector contract explicit about optional capabilities.
- A single large refactor can stall progress.
  Mitigation: extract services first and keep route contracts stable.
- Recalculation bugs can change leaderboard trust.
  Mitigation: cover ranking logic with deterministic fixture tests.

## Recommended implementation scope

The first implementation pass must include:

- one connector contract;
- one fixture connector;
- one simulation connector;
- one ROI-first competition engine;
- one computed leaderboard cache path; and
- one hourly sync path.

The first implementation pass must not include:

- a configurable rules engine;
- CSV ingest;
- real-time sync; or
- a full multi-broker admin UX.

## Next steps

Now that the design is defined, the next step is to turn it into an
implementation plan for this repo. The plan should break the work into small
server-side milestones that let you replace mocked leaderboard behavior early,
add fixture and simulation connectors, and then layer in a live broker without
rewriting the competition engine.
