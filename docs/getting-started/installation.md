# Installation

This guide will walk you through setting up LiveTradingLeague on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/downloads)

### Optional Prerequisites

- **Docker** & **Docker Compose** - For containerized deployment
- **Cloudinary Account** - For image uploads (free tier available)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/livetradingcoder/trade-cmp.git
cd trade-cmp
```

### 2. Install Dependencies

The project uses a monorepo structure with Turborepo. Install all dependencies from the root:

```bash
npm install
```

This will install dependencies for both the server and web packages.

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/trade_arena

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Encryption Key (required for SMTP password encryption)
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (optional - can be configured in admin panel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=LiveTradingLeague <noreply@livetradingleague.com>

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001
```

### 4. Set Up MongoDB

#### Option A: Local MongoDB

If you installed MongoDB locally:

```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# On Windows:
# MongoDB should start automatically as a service
```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` with your Atlas connection string

### 5. Seed the Database

Create the initial admin user and sample data:

```bash
npm run db:seed
```

Default admin credentials:
- **Username**: `admin`
- **Password**: `admin123`

**Important**: Change these credentials after first login!

### 6. Start the Development Server

```bash
npm run dev
```

This will start both the backend and frontend servers:
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:5173

## Verify Installation

1. Open your browser and navigate to http://localhost:5173
2. You should see the LiveTradingLeague homepage
3. Click "Admin Login" and use the default credentials
4. You should be able to access the admin dashboard

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**: Ensure MongoDB is running:
```bash
# Check MongoDB status
# macOS:
brew services list | grep mongodb

# Linux:
sudo systemctl status mongod
```

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution**: Another process is using port 3001 or 5173. Either:
- Stop the other process
- Change the port in your `.env` file

### Module Not Found Errors

**Error**: `Cannot find module 'xyz'`

**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Cloudinary Upload Errors

**Error**: `Cloudinary configuration not found`

**Solution**: Cloudinary is optional. Either:
- Configure Cloudinary credentials in `.env`
- Or skip image uploads (tournaments will use default images)

## Next Steps

Now that you have LiveTradingLeague installed:

1. [Quick Start Guide](/getting-started/quick-start) - Learn the basics
2. [Development Guide](/getting-started/development) - Set up your development workflow
3. [Architecture Overview](/guide/architecture) - Understand the system design

## Docker Installation (Alternative)

If you prefer using Docker:

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:80
- Backend: http://localhost:3001

See [Docker Deployment](/deployment/docker) for more details.
