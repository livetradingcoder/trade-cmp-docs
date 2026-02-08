# Changelog

All notable changes to LiveTradingLeague will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-08

### Added

#### SMTP Configuration Management
- Database-backed SMTP configuration system
- Admin panel UI for managing email settings
- AES-256-CBC encryption for SMTP passwords
- Test email functionality to verify configuration
- Backward compatibility with environment variables
- Dynamic email transporter creation

#### Broker Integration
- Complete FP Markets broker integration
- User registration with account validation
- Participant application system
- Mock broker API endpoints for development
- Referral code verification
- Account status tracking

#### User Management
- User model with FP Markets integration
- Email and account number validation
- Display name and verification status
- Referral code tracking
- New vs existing user differentiation

#### Participant Management
- Participant model with status workflow
- Application submission and review
- Approval/decline with reasons
- Disqualification system
- Admin audit trail
- Email notifications for status changes

#### Admin Dashboard
- Comprehensive participant management UI
- Application review interface
- Bulk actions and filtering
- Status change tracking
- Notes and reason fields
- Real-time pending counts

#### Email System
- Automated email notifications
- Application submitted confirmation
- Approval notifications
- Decline notifications with reasons
- Disqualification notifications
- Password reset emails
- SMTP configuration via admin panel

#### Documentation
- Complete architecture documentation
- API reference documentation
- Development setup guides
- Testing guides
- Deployment instructions
- Broker integration requirements

### Changed
- Renamed "Trade Arena" to "LiveTradingLeague" across codebase
- Updated email templates with new branding
- Improved error handling and validation
- Enhanced security with password encryption

### Fixed
- Email service graceful degradation
- SMTP configuration fallback logic
- Password masking in API responses

## [0.1.0] - 2026-01-15

### Added
- Initial project setup with Turborepo
- Basic tournament management
- Admin authentication system
- MongoDB database integration
- Cloudinary image uploads
- Docker deployment configuration

---

## Version History

- **1.0.0** (2026-02-08) - Production release with broker integration
- **0.1.0** (2026-01-15) - Initial alpha release

## Upgrade Guides

### Upgrading to 1.0.0

If you're upgrading from 0.1.0, follow these steps:

1. **Add ENCRYPTION_KEY to environment**:
   ```bash
   ENCRYPTION_KEY=your-32-character-encryption-key-here
   ```

2. **Run database migrations** (if any):
   ```bash
   npm run db:migrate
   ```

3. **Configure SMTP in admin panel**:
   - Navigate to Admin Dashboard → Settings
   - Configure Email (SMTP) settings
   - Test email configuration

4. **Update environment variables**:
   - Review new environment variables in `.env.example`
   - Update your `.env` file accordingly

## Breaking Changes

### 1.0.0

- Email configuration now requires `ENCRYPTION_KEY` environment variable
- SMTP settings moved from environment variables to database (backward compatible)
- Tournament model updated with new status fields

## Deprecations

### 1.0.0

- Environment-based SMTP configuration is deprecated in favor of admin panel configuration
- Legacy email service will be removed in 2.0.0
