# Database Models

All models are Mongoose schemas in `packages/server/src/models/`. They fall into
three groups: **platform** (admin, tournaments, settings), **competition**
(users, participants), and **broker data** (trading accounts, snapshots, trades,
sync runs, leaderboard cache).

## Platform

### Tournament
```typescript
{
  title: string;
  tier: string;                  // "Weekly" | "Bi-Weekly" | "Monthly"
  prize: string; fee: string;
  participants: number;
  timeLabel: string; timeLeft: string;
  cover: string; image?: string;
  registrationLink: string;
  status: "draft" | "active" | "completed" | "archived";
  start_date?: Date; end_date?: Date;
}
```

### Admin
```typescript
{ username: string; email: string; password: string;   // bcrypt
  resetPasswordToken?: string; resetPasswordExpires?: Date; }
```

### Settings
```typescript
{ key: string; value: string; }   // key-value, e.g. affiliateCode
```

## Competition

### User
```typescript
{
  email: string;                 // unique
  fp_account_number: string;     // unique
  display_name?: string;
  account_verified: boolean; verified_at?: Date;
  referral_code_used?: string;
  is_new_user: boolean;
}
```

### Participant
```typescript
{
  tournament_id: ObjectId; user_id: ObjectId;
  status: "pending" | "approved" | "declined" | "disqualified";
  referral_code_verified: boolean;
  applied_at: Date; reviewed_at?: Date; reviewed_by?: ObjectId;
  decline_reason?: string;
  disqualified_at?: Date; disqualified_by?: ObjectId; disqualification_reason?: string;
}
```

## Broker Data

### BrokerIntegration
```typescript
{
  type: "fixture" | "simulation" | "fpmarkets";
  name: string; enabled: boolean;
  supports_account_validation: boolean;
  supports_raw_trades: boolean;
  supports_snapshots: boolean;
  supports_broker_metrics: boolean;
  sync_frequency: "hourly";
  last_sync_at?: Date;
  last_sync_status?: "idle" | "success" | "partial" | "failed";
  config: Record<string, unknown>;
}
```

### TradingAccount
```typescript
{
  user_id: ObjectId; participant_id: ObjectId; tournament_id: ObjectId;
  broker_integration_id: ObjectId;
  broker_account_number: string;
  status: "active" | "pending" | "disabled";
  validated_at?: Date; last_synced_at?: Date;
  sync_state: "idle" | "ready" | "error";
}
```

### AccountSnapshot
```typescript
{
  trading_account_id: ObjectId;
  captured_at: Date;             // unique with trading_account_id
  balance: number; equity: number; currency: string;
  source: "fixture" | "simulation" | "broker";
}
```

### Trade
```typescript
{
  trading_account_id: ObjectId; broker_trade_id: string;
  opened_at: Date; closed_at?: Date;
  symbol: string; side: "buy" | "sell"; volume: number;
  open_price: number; close_price?: number;
  fees: number; swap: number; net_pnl: number; currency: string;
  source: "fixture" | "simulation" | "broker";
}
```

### SyncRun
```typescript
{
  tournament_id: ObjectId; broker_integration_id: ObjectId;
  started_at: Date; finished_at?: Date;
  status: "running" | "success" | "partial" | "failed";
  accounts_processed: number; snapshots_written: number;
  trades_written: number; leaderboard_entries_written: number;
  error_summary?: string;
}
```

### LeaderboardCache
```typescript
{
  tournament_id: ObjectId;       // unique
  rankings: Array<{
    rank: number; participant_id: ObjectId; trading_account_id: ObjectId;
    display_name: string; account_masked: string;
    roi: number; pnl: number; win_rate: number; trade_count: number;
    calculation_source: "computed_raw" | "broker_metrics";
    calculation_status: "ranked" | "insufficient_data";
    updated_at: Date;
  }>;
  fetched_at: Date; expires_at: Date;   // 15-min TTL
}
```

See [FP Markets Sync](/guide/fp-markets-sync) for how the broker-data models are
populated.
