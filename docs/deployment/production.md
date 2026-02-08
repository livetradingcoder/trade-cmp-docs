# Production Deployment

This guide covers deploying LiveTradingLeague to a production environment.

## Prerequisites

Before deploying to production:

- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- MongoDB Atlas account or production MongoDB server
- Cloudinary account for image hosting
- SMTP service for emails (Gmail, SendGrid, AWS SES, etc.)
- Server with Docker installed (recommended)

## Environment Configuration

### 1. Production Environment Variables

Create a `.env` file with production values:

```env
# Database - Use MongoDB Atlas for production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/livetradingleague?retryWrites=true&w=majority

# Security - Generate strong secrets!
JWT_SECRET=your-production-jwt-secret-min-32-characters
ENCRYPTION_KEY=your-production-encryption-key-min-32-characters

# Server
NODE_ENV=production
PORT=3001
BACKEND_PORT=3001

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_production_cloud_name
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret

# Email - Configure via admin panel after deployment
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASS=your_production_app_password
EMAIL_FROM=LiveTradingLeague <noreply@livetradingleague.com>

# Frontend
FRONTEND_URL=https://your-domain.com
VITE_API_URL=https://your-domain.com
```

### 2. Generate Secure Secrets

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Step 1: Build Docker Image

```bash
# Clone repository
git clone https://github.com/livetradingcoder/trade-cmp.git
cd trade-cmp

# Build production image
docker build -t livetradingleague:latest .
```

#### Step 2: Run with Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Step 3: Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/livetradingleague`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/livetradingleague /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 4: SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

### Option 2: Manual Deployment

#### Step 1: Install Dependencies

```bash
# On your server
git clone https://github.com/livetradingcoder/trade-cmp.git
cd trade-cmp
npm install
```

#### Step 2: Build Frontend

```bash
cd packages/web
npm run build
```

#### Step 3: Start Backend with PM2

```bash
# Install PM2
npm install -g pm2

# Start backend
cd packages/server
pm2 start npm --name "livetradingleague-api" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Step 4: Serve Frontend with Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/trade-cmp/packages/web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        # ... proxy headers
    }
}
```

## Post-Deployment Steps

### 1. Create Admin User

```bash
# SSH into your server
cd trade-cmp
npm run db:seed
```

### 2. Change Default Credentials

1. Login to admin panel
2. Go to Settings → Change Password
3. Update admin credentials

### 3. Configure SMTP

1. Login to admin panel
2. Go to Settings → Email (SMTP) Configuration
3. Enter your production SMTP credentials
4. Send test email to verify

### 4. Update Affiliate Code

1. Go to Settings → Affiliate Code
2. Enter your FP Markets affiliate code
3. Save settings

## Monitoring

### Application Logs

```bash
# Docker logs
docker-compose logs -f

# PM2 logs
pm2 logs livetradingleague-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health Checks

```bash
# Check API health
curl https://your-domain.com/api/health

# Expected response:
# {"status":"ok","database":"mongodb"}
```

### Database Backups

```bash
# MongoDB Atlas - Configure automatic backups in Atlas dashboard

# Self-hosted MongoDB
mongodump --uri="mongodb://localhost:27017/livetradingleague" --out=/backups/$(date +%Y%m%d)
```

## Security Checklist

- [ ] Strong JWT_SECRET and ENCRYPTION_KEY generated
- [ ] Default admin credentials changed
- [ ] SSL certificate installed and auto-renewal configured
- [ ] Firewall configured (allow only 80, 443, 22)
- [ ] MongoDB authentication enabled
- [ ] Environment variables secured (not in version control)
- [ ] CORS configured for production domain only
- [ ] Security headers configured in Nginx
- [ ] Regular backups scheduled
- [ ] Monitoring and alerting configured

## Scaling Considerations

### Horizontal Scaling

For high traffic:

1. **Load Balancer**: Use Nginx or AWS ALB
2. **Multiple Backend Instances**: Run multiple API servers
3. **Session Management**: Use Redis for session storage
4. **Database**: MongoDB replica set or sharding

### Vertical Scaling

Increase server resources:
- CPU: 2+ cores recommended
- RAM: 4GB+ recommended
- Storage: SSD with 20GB+ free space

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose logs

# Check environment variables
docker-compose config

# Restart services
docker-compose restart
```

### Database Connection Issues

```bash
# Test MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/livetradingleague"

# Check network connectivity
ping cluster.mongodb.net
```

### Email Not Sending

1. Check SMTP configuration in admin panel
2. Test SMTP settings using test email feature
3. Check email service logs
4. Verify firewall allows outbound SMTP connections

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Or with PM2
pm2 restart livetradingleague-api
```

## Rollback Procedure

```bash
# Revert to previous version
git checkout <previous-commit-hash>

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

## Support

For production deployment support:
- Email: livetradingcoderlive-trading-league@proton.me
- GitHub Issues: https://github.com/livetradingcoder/trade-cmp/issues
