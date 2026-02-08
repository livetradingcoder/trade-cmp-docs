---
layout: home

hero:
  name: LiveTradingLeague
  text: Trading Competition Platform
  tagline: Comprehensive documentation for building and managing trading competitions
  image:
    src: /logo.svg
    alt: LiveTradingLeague
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/livetradingcoder/trade-cmp

features:
  - icon: 🏆
    title: Tournament Management
    details: Create and manage trading competitions with customizable tiers, prizes, and participant limits.

  - icon: 👥
    title: User Management
    details: Comprehensive user registration, authentication, and participant tracking system.

  - icon: 🔌
    title: Broker Integration
    details: Seamless integration with FP Markets broker API for account validation and performance tracking.

  - icon: 📊
    title: Real-time Leaderboards
    details: Live performance tracking with ROI calculations and ranking systems.

  - icon: 📧
    title: Email Notifications
    details: Automated email system for participant updates, approvals, and notifications.

  - icon: 🎨
    title: Modern UI
    details: Beautiful, responsive interface built with React, Framer Motion, and modern design principles.

  - icon: 🔒
    title: Secure Admin Panel
    details: JWT-based authentication with comprehensive admin dashboard for platform management.

  - icon: 🚀
    title: Production Ready
    details: Docker deployment, MongoDB database, and scalable architecture for production use.
---


## 📜 Document History

| Version | Date | Description | Link |
|:---|:---|:---|:---|
| **v1.2** | 2026-02-05 | **Current Version** - Final Broker Integration Requirements | [View Requirements v1.2](/requirements/v1.2) |
| **v1.1** | 2026-01-28 | Initial Broker Integration Draft | [View Requirements v1.1](/requirements/v1.1) |
| **v1.0** | 2026-01-15 | Project Inception & Initial Scoping | - |

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph "LiveTradingLeague Platform"
        WEB[Web Application]
        API[Backend API]
        DB[(Database - MongoDB)]
    end

    subgraph "FP Markets"
        BROKER_API[Broker API]
        BROKER_DB[(Trading Data)]
    end

    WEB --> API
    API --> DB
    API <-->|Account Validation| BROKER_API
    BROKER_API --> BROKER_DB
```

## Quick Start

Get up and running in minutes:

```bash
# Clone the repository
git clone https://github.com/livetradingcoder/trade-cmp.git
cd trade-cmp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Latest Updates

### Version 1.0.0 (February 2026)

- ✅ Complete broker integration with FP Markets
- ✅ User registration and participant management
- ✅ Admin dashboard with comprehensive controls
- ✅ Email notification system
- ✅ Real-time leaderboard tracking
- ✅ SMTP configuration management
- ✅ Production-ready Docker deployment

[View full changelog →](/changelog)

## Architecture Overview

LiveTradingLeague is built as a modern full-stack application:

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT-based secure authentication
- **Deployment**: Docker + Docker Compose
- **Monorepo**: Turborepo for efficient builds

[Learn more about the architecture →](/guide/architecture)

## Community & Support

- 📖 [Documentation](/)
- 💬 [GitHub Discussions](https://github.com/livetradingcoder/trade-cmp/discussions)
- 🐛 [Issue Tracker](https://github.com/livetradingcoder/trade-cmp/issues)
- 📧 [Email Support](mailto:livetradingcoderlive-trading-league@proton.me)
