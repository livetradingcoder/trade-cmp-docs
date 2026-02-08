# Introduction

Welcome to the LiveTradingLeague documentation! This guide will help you understand, set up, and customize the platform for managing trading competitions.

## What is LiveTradingLeague?

LiveTradingLeague is a comprehensive full-stack platform designed to manage trading competitions. It provides:

- **Tournament Management**: Create and manage multiple trading competitions with different tiers and prize structures
- **User Registration**: Seamless user onboarding with broker account integration
- **Participant Management**: Complete workflow for application review, approval, and tracking
- **Real-time Leaderboards**: Live performance tracking with ROI calculations
- **Admin Dashboard**: Comprehensive control panel for platform management
- **Email Notifications**: Automated communication system for participants
- **Broker Integration**: Direct integration with FP Markets for account validation

## Key Features

### For Administrators

- **Secure Authentication**: JWT-based admin authentication system
- **Tournament Creation**: Easy-to-use interface for creating competitions
- **Participant Review**: Streamlined application review process
- **Performance Tracking**: Real-time monitoring of participant performance
- **Email Management**: Configure SMTP settings directly from the admin panel
- **Settings Management**: Dynamic configuration without code changes

### For Participants

- **Simple Registration**: Quick sign-up with broker account validation
- **Tournament Application**: Easy application process with status tracking
- **Email Notifications**: Automated updates on application status
- **Leaderboard Access**: View real-time competition standings

## Technology Stack

LiveTradingLeague is built with modern, production-ready technologies:

**Frontend**:
- React 19 with TypeScript
- Vite for fast development and builds
- Framer Motion for smooth animations
- Lucide React for beautiful icons

**Backend**:
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication
- Nodemailer for email services

**Infrastructure**:
- Docker for containerization
- Turborepo for monorepo management
- Cloudinary for image hosting
- GitHub Actions for CI/CD

## Architecture Overview

The platform follows a modern monorepo architecture:

```
trade-cmp/
├── packages/
│   ├── server/     # Backend API
│   └── web/        # Frontend application
├── docker-compose.yml
├── Dockerfile
└── turbo.json
```

## Use Cases

LiveTradingLeague is perfect for:

- **Broker Platforms**: Engage traders with competitive tournaments
- **Trading Communities**: Organize community competitions
- **Educational Institutions**: Run trading simulations and competitions
- **Marketing Campaigns**: Attract new traders with prize-based competitions

## Next Steps

Ready to get started? Follow these guides:

1. [Installation](/getting-started/installation) - Set up your development environment
2. [Quick Start](/getting-started/quick-start) - Get the platform running in minutes
3. [Development Guide](/getting-started/development) - Learn about the development workflow

## Support

Need help? Here's how to get support:

- **Documentation**: Browse this documentation site
- **GitHub Issues**: [Report bugs or request features](https://github.com/livetradingcoder/trade-cmp/issues)
- **Email**: livetradingcoderlive-trading-league@proton.me

## License

LiveTradingLeague is released under the MIT License. See [LICENSE](https://github.com/livetradingcoder/trade-cmp/blob/main/LICENSE) for details.
