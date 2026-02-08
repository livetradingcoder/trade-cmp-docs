# API Overview

LiveTradingLeague provides a RESTful API for managing tournaments, users, and participants. This guide covers the API structure, authentication, and common patterns.

## Base URL

**Development**: `http://localhost:3001/api`
**Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

Login to get a JWT token:

```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

## Rate Limiting

Currently, there are no rate limits implemented. This may change in future versions.

## API Endpoints

### Authentication

- `POST /api/admin/login` - Admin login
- `POST /api/admin/forgot-password` - Request password reset
- `POST /api/admin/reset-password/:token` - Reset password
- `GET /api/admin/verify` - Verify JWT token
- `POST /api/admin/change-password` - Change password (authenticated)

### Tournaments

- `GET /api/tournaments` - List all tournaments
- `GET /api/tournaments/:id` - Get tournament details
- `POST /api/tournaments` - Create tournament (admin)
- `PUT /api/tournaments/:id` - Update tournament (admin)
- `DELETE /api/tournaments/:id` - Delete tournament (admin)

### Users

- `POST /api/users/register` - Register new user
- `GET /api/users/:id` - Get user details

### Participants

- `POST /api/participants/apply` - Apply to tournament
- `GET /api/participants/:tournamentId` - List participants (admin)
- `PUT /api/participants/:id/approve` - Approve participant (admin)
- `PUT /api/participants/:id/decline` - Decline participant (admin)
- `PUT /api/participants/:id/disqualify` - Disqualify participant (admin)

### Settings

- `GET /api/settings` - Get all settings
- `GET /api/settings/:key` - Get specific setting
- `PUT /api/settings/:key` - Update setting (admin)
- `POST /api/settings/smtp/test` - Test SMTP configuration (admin)

### Broker API (Mock)

- `POST /api/broker/validate` - Validate account
- `GET /api/broker/info` - Get account info
- `POST /api/broker/performance` - Get performance data

### Leaderboard

- `GET /api/leaderboard/:tournamentId` - Get tournament leaderboard (admin)

## Common Patterns

### Pagination

Currently, pagination is not implemented. All list endpoints return complete results.

### Filtering

Some endpoints support filtering via query parameters:

```http
GET /api/participants/:tournamentId?status=pending
```

### Sorting

Results are typically sorted by creation date (newest first).

## Error Handling

Always check the `success` field in responses:

```javascript
const response = await fetch('/api/tournaments');
const data = await response.json();

if (data.success) {
  // Handle success
  console.log(data.tournaments);
} else {
  // Handle error
  console.error(data.error);
}
```

## CORS

CORS is enabled for all origins in development. In production, configure allowed origins in the server configuration.

## Data Types

### Tournament Object

```typescript
{
  id: string;
  title: string;
  tier: "Weekly" | "Monthly" | "Quarterly";
  prize: string;
  fee: string;
  participants: number;
  timeLabel: string;
  timeLeft: string;
  cover: string;
  image: string;
  registrationLink: string;
  status: "draft" | "active" | "completed";
  start_date: Date | null;
  end_date: Date | null;
}
```

### User Object

```typescript
{
  id: string;
  email: string;
  fp_account_number: string;
  display_name?: string;
  account_verified: boolean;
  verified_at?: Date;
  is_new_user: boolean;
  referral_code_used?: string;
}
```

### Participant Object

```typescript
{
  id: string;
  tournament_id: string;
  user_id: string;
  status: "pending" | "approved" | "declined" | "disqualified";
  applied_at: Date;
  reviewed_at?: Date;
  reviewed_by?: string;
  decline_reason?: string;
  disqualified_at?: Date;
  disqualified_by?: string;
  disqualification_reason?: string;
  notes?: string;
}
```

## Next Steps

Explore detailed API documentation:

- [Authentication API](/api/authentication)
- [Tournaments API](/api/tournaments)
- [Users API](/api/users)
- [Participants API](/api/participants)
- [Settings API](/api/settings)

## Testing the API

Use tools like:
- **Postman** - [Download](https://www.postman.com/downloads/)
- **Insomnia** - [Download](https://insomnia.rest/download)
- **curl** - Command line tool
- **HTTPie** - [Download](https://httpie.io/)

Example with curl:

```bash
# Login
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get tournaments
curl http://localhost:3001/api/tournaments

# Create tournament (with auth)
curl -X POST http://localhost:3001/api/tournaments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"New Tournament","registrationLink":"https://example.com"}'
```
