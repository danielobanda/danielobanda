# 🚀 Student Management System - Deployment Guide

This comprehensive guide covers multiple deployment options for the Student Management System, from development to production-ready deployments.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Platform Deployment](#cloud-platform-deployment)
5. [VPS/Server Deployment](#vpsserver-deployment)
6. [Production Configuration](#production-configuration)
7. [Security Checklist](#security-checklist)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: v16.0.0 or higher
- **PostgreSQL**: v12.0 or higher
- **Docker**: v20.0 or higher (for containerized deployment)
- **Docker Compose**: v2.0 or higher
- **Git**: Latest version
- **SSL Certificate**: Required for production HTTPS

### Recommended Server Specifications

| Environment | CPU | RAM | Storage | Network |
|-------------|-----|-----|---------|---------|
| Development | 2 cores | 4 GB | 20 GB | 1 Mbps |
| Small Production | 2 cores | 8 GB | 50 GB | 10 Mbps |
| Medium Production | 4 cores | 16 GB | 100 GB | 100 Mbps |
| Large Production | 8+ cores | 32+ GB | 200+ GB | 1 Gbps |

## Local Development Setup

### 1. Quick Start (Recommended for Development)

```bash
# Clone the repository
git clone https://github.com/danielobanda/student-management-system.git
cd student-management-system

# Install dependencies
npm install
cd server && npm install
cd ../client && npm install

# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your configuration

# Set up database
createdb sms_database

# Run database migrations
cd server && npm run migrate

# Start development servers
cd .. && npm run dev
```

### 2. Manual Setup

```bash
# Database setup
sudo -u postgres psql
CREATE DATABASE sms_database;
CREATE USER sms_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sms_database TO sms_user;
\q

# Server setup
cd server
npm install
npm run migrate
npm run seed  # Optional: Load sample data

# Client setup
cd ../client
npm install

# Start servers separately
# Terminal 1: Server
cd server && npm run server

# Terminal 2: Client
cd client && npm start
```

## Docker Deployment

### 1. Development with Docker

```bash
# Clone and setup
git clone https://github.com/danielobanda/student-management-system.git
cd student-management-system

# Copy environment file
cp server/.env.example .env
# Edit .env with your configuration

# Build and run
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432
```

### 2. Production with Docker

```bash
# Prepare production environment
cp .env.production .env
# Edit .env with production values

# Make deployment script executable
chmod +x scripts/deploy.sh

# Deploy to production
./scripts/deploy.sh production

# Or manually:
docker-compose -f docker-compose.prod.yml up --build -d
```

### 3. Docker Commands Reference

```bash
# View logs
docker-compose logs -f

# Access containers
docker-compose exec api bash
docker-compose exec postgres psql -U postgres -d sms_database

# Stop services
docker-compose down

# Remove volumes (⚠️ This will delete data)
docker-compose down -v

# Update and restart
docker-compose pull
docker-compose up -d --force-recreate
```

## Cloud Platform Deployment

### 1. Heroku Deployment

#### Preparation
```bash
# Install Heroku CLI
# Visit: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create applications
heroku create sms-api
heroku create sms-frontend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev -a sms-api
```

#### Backend Deployment
```bash
# Navigate to server directory
cd server

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Set Heroku remote
heroku git:remote -a sms-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CLIENT_URL=https://sms-frontend.herokuapp.com

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
```

#### Frontend Deployment
```bash
# Navigate to client directory
cd client

# Build for production
npm run build

# Deploy to Netlify, Vercel, or Heroku
# For Heroku:
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a sms-frontend
git push heroku main
```

### 2. DigitalOcean App Platform

#### app.yaml Configuration
```yaml
name: student-management-system
services:
- name: api
  source_dir: server
  github:
    repo: your-username/student-management-system
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}

- name: frontend
  source_dir: client
  github:
    repo: your-username/student-management-system
    branch: main
  build_command: npm run build
  run_command: serve -s build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs

databases:
- name: db
  engine: PG
  version: "13"
  size_slug: db-s-1vcpu-1gb
```

### 3. AWS Deployment

#### Using AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init sms-api

# Create environment
eb create production

# Deploy
eb deploy

# Set environment variables
eb setenv NODE_ENV=production JWT_SECRET=your_secret
```

#### Using AWS ECS (Docker)
```yaml
# docker-compose.aws.yml
version: '3.8'
services:
  api:
    image: your-registry/sms-api:latest
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
```

## VPS/Server Deployment

### 1. Ubuntu Server Setup

#### Initial Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2 for process management
sudo npm install -g pm2

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Database Setup
```bash
# Configure PostgreSQL
sudo -u postgres psql
CREATE DATABASE sms_production;
CREATE USER sms_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE sms_production TO sms_user;
\q

# Configure PostgreSQL for remote connections
sudo nano /etc/postgresql/13/main/postgresql.conf
# Uncomment and modify: listen_addresses = 'localhost'

sudo nano /etc/postgresql/13/main/pg_hba.conf
# Add: local all sms_user md5

sudo systemctl restart postgresql
```

#### Application Deployment
```bash
# Create application directory
sudo mkdir -p /var/www/sms
sudo chown $USER:$USER /var/www/sms

# Clone repository
cd /var/www/sms
git clone https://github.com/danielobanda/student-management-system.git .

# Install dependencies
npm install
cd server && npm install
cd ../client && npm install

# Build frontend
cd client && npm run build
cd ..

# Copy built files to server directory
cp -r client/build/* server/public/

# Configure environment
cp server/.env.example server/.env
nano server/.env
# Update with production values

# Run migrations
cd server && npm run migrate

# Start with PM2
pm2 start server/server.js --name "sms-api"
pm2 save
pm2 startup
```

#### Nginx Configuration
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/sms

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/sms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL Certificate with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl status certbot.timer
```

### 2. Process Management with PM2

```bash
# PM2 configuration file
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'sms-api',
    script: './server/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
};

# Start with PM2
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit

# Logs
pm2 logs sms-api

# Restart
pm2 restart sms-api

# Stop
pm2 stop sms-api
```

## Production Configuration

### 1. Environment Variables Security

```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Required production environment variables
NODE_ENV=production
JWT_SECRET=your_64_character_secret_here
DB_PASSWORD=strong_database_password
REDIS_PASSWORD=strong_redis_password
ENCRYPTION_KEY=32_character_encryption_key
```

### 2. Database Performance Tuning

```sql
-- PostgreSQL production settings
-- /etc/postgresql/13/main/postgresql.conf

shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

### 3. Nginx Performance Optimization

```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

http {
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=3r/m;
}
```

## Security Checklist

### 📋 Pre-Production Security Checklist

- [ ] **Environment Variables**
  - [ ] JWT secret is 64+ characters random string
  - [ ] Database passwords are strong (20+ characters)
  - [ ] All default passwords changed
  - [ ] API keys secured and rotated

- [ ] **Database Security**
  - [ ] Database user has minimal required permissions
  - [ ] Database not exposed to public internet
  - [ ] Connection encryption enabled
  - [ ] Regular security updates applied

- [ ] **Application Security**
  - [ ] HTTPS enforced (SSL/TLS certificate installed)
  - [ ] Security headers configured
  - [ ] Rate limiting implemented
  - [ ] Input validation enabled
  - [ ] File upload restrictions in place

- [ ] **Server Security**
  - [ ] Firewall configured (UFW/iptables)
  - [ ] SSH key authentication enabled
  - [ ] Regular security updates scheduled
  - [ ] Non-root user for application
  - [ ] Fail2ban installed and configured

- [ ] **Monitoring**
  - [ ] Application logs configured
  - [ ] Error monitoring setup
  - [ ] Uptime monitoring enabled
  - [ ] Performance monitoring active

### 🔥 Firewall Configuration

```bash
# UFW firewall setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status verbose
```

## Monitoring and Maintenance

### 1. Application Monitoring

#### Health Check Endpoints
```javascript
// Already implemented in server/server.js
GET /health - Basic health check
GET /api/health - API health with database check
```

#### Log Management
```bash
# Setup log rotation
sudo nano /etc/logrotate.d/sms

/var/www/sms/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload sms-api
    endscript
}
```

### 2. Database Monitoring

```sql
-- Monitor database performance
SELECT * FROM pg_stat_activity;
SELECT * FROM pg_stat_database;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 3. Automated Backups

```bash
# Setup automated backups with cron
crontab -e

# Add backup schedule (daily at 2 AM)
0 2 * * * /var/www/sms/scripts/backup.sh

# Weekly full backup
0 2 * * 0 /var/www/sms/scripts/full-backup.sh
```

### 4. Update Management

```bash
# Create update script
# scripts/update.sh
#!/bin/bash
cd /var/www/sms
git pull origin main
npm install
cd server && npm install
cd ../client && npm install && npm run build
cp -r ../client/build/* ../server/public/
pm2 restart sms-api
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U sms_user -d sms_production

# Check logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

#### 2. Application Won't Start
```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs sms-api

# Check Node.js version
node --version

# Restart application
pm2 restart sms-api
```

#### 3. High Memory Usage
```bash
# Monitor memory usage
htop
free -h

# Check PM2 processes
pm2 monit

# Restart if needed
pm2 restart sms-api
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --dry-run

# Test SSL configuration
sudo nginx -t
```

### Emergency Procedures

#### 1. Database Recovery
```bash
# Restore from backup
gunzip -c /backups/sms_production_backup_YYYYMMDD.sql.gz | psql -U sms_user -d sms_production
```

#### 2. Application Rollback
```bash
# Rollback to previous version
cd /var/www/sms
git log --oneline -10
git checkout COMMIT_HASH
pm2 restart sms-api
```

#### 3. Emergency Contacts
- **Technical Lead**: your-email@domain.com
- **System Administrator**: admin@domain.com
- **On-call Support**: +1-XXX-XXX-XXXX

## Performance Optimization

### 1. Application Level
- Enable Node.js clustering with PM2
- Implement Redis caching for frequently accessed data
- Optimize database queries with proper indexing
- Use CDN for static assets

### 2. Database Level
- Regular VACUUM and ANALYZE operations
- Proper indexing strategy
- Connection pooling
- Query optimization

### 3. Infrastructure Level
- Load balancing for high traffic
- Auto-scaling configuration
- Content Delivery Network (CDN)
- Database read replicas

---

## 📞 Support and Maintenance

For deployment support and maintenance:

1. **Documentation**: Check this guide and README.md
2. **Issues**: Create GitHub issues for bugs
3. **Community**: Join our Discord/Slack community
4. **Professional Support**: Contact daniel@yourdomain.com

---

**Remember**: Always test deployments in a staging environment before applying to production! 🚀