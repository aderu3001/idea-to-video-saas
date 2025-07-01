# Deployment Guide - Idea to Video SAAS

## Overview
This guide will help you deploy your existing n8n workflows as a multi-user SAAS platform.

## Architecture
```
Frontend (Next.js) → Backend API → PostgreSQL Database
                                ↓
                            n8n Workflows → Kie.ai + Blotato
```

## Prerequisites
- DigitalOcean account
- Domain name
- Kie.ai API key
- Blotato API key
- Stripe account

## Step 1: Set up DigitalOcean Infrastructure

### Create Droplets
```bash
# Main application server
doctl compute droplet create idea-to-video-app \
  --size s-2vcpu-4gb \
  --image ubuntu-22-04-x64 \
  --region nyc1

# Database server
doctl compute droplet create idea-to-video-db \
  --size s-1vcpu-2gb \
  --image ubuntu-22-04-x64 \
  --region nyc1

# n8n server (if separate)
doctl compute droplet create idea-to-video-n8n \
  --size s-1vcpu-2gb \
  --image ubuntu-22-04-x64 \
  --region nyc1
```

## Step 2: Database Setup

### Install PostgreSQL
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb idea_to_video
sudo -u postgres psql -c "CREATE USER app_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE idea_to_video TO app_user;"
```

### Run Schema
```bash
psql -h your_db_host -U app_user -d idea_to_video -f database/schema.sql
```

## Step 3: Application Server Setup

### Install Dependencies
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone and setup project
git clone https://github.com/aderu3001/idea-to-video-saas.git
cd idea-to-video-saas
npm install
```

### Environment Configuration
```bash
cp .env.example .env
# Edit .env with your actual values:
# - Database connection string
# - API keys (Kie.ai, Blotato, Stripe)
# - JWT secret
# - n8n webhook URL
```

### Start Services
```bash
# Build frontend
npm run build

# Start backend with PM2
pm2 start server/index.js --name "idea-to-video-api"

# Start frontend with PM2
pm2 start npm --name "idea-to-video-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

## Step 4: n8n Setup

### Install n8n
```bash
npm install -g n8n

# Or use Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e WEBHOOK_URL=https://your-domain.com \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Import Your Workflows
1. Access n8n at `http://your-server:5678`
2. Import the workflow from `n8n-workflows/idea-to-video-workflow.json`
3. Configure credentials for Kie.ai and Blotato
4. Set up webhook endpoint
5. Test the workflow

### Configure Webhook
- Set webhook URL in your backend: `N8N_WEBHOOK_URL=http://your-n8n-server:5678/webhook/idea-submit`
- Ensure n8n can receive requests from your backend

## Step 5: Domain & SSL Setup

### Configure Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # n8n (if on same server)
    location /n8n {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Step 6: Configure Social OAuth

### Instagram
1. Create Facebook App
2. Add Instagram Basic Display product
3. Configure redirect URI: `https://your-domain.com/auth/instagram/callback`

### YouTube
1. Create Google Cloud Project
2. Enable YouTube Data API v3
3. Configure OAuth consent screen
4. Set redirect URI: `https://your-domain.com/auth/youtube/callback`

### TikTok
1. Create TikTok Developer account
2. Create app and get client credentials
3. Set redirect URI: `https://your-domain.com/auth/tiktok/callback`

## Step 7: Stripe Setup

### Configure Webhooks
```bash
# Add webhook endpoint in Stripe dashboard
https://your-domain.com/api/stripe/webhook

# Events to listen for:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

## Step 8: Testing

### Test User Flow
1. Register new user
2. Connect social accounts
3. Submit idea for video generation
4. Verify n8n workflow execution
5. Check video generation and posting

### Monitor Logs
```bash
# Backend logs
pm2 logs idea-to-video-api

# Frontend logs
pm2 logs idea-to-video-frontend

# n8n logs
docker logs n8n  # if using Docker
```

## Step 9: Scaling Considerations

### Database Optimization
- Set up read replicas for heavy queries
- Implement connection pooling
- Add database indexes for performance

### Application Scaling
- Use load balancer for multiple app instances
- Implement Redis for session management
- Set up CDN for static assets

### n8n Scaling
- Use n8n with queue mode for high volume
- Set up multiple n8n instances
- Implement workflow monitoring

## Monitoring & Maintenance

### Set up Monitoring
- Application performance monitoring (APM)
- Database monitoring
- n8n workflow monitoring
- Error tracking (Sentry)

### Backup Strategy
- Daily database backups
- Application code backups
- n8n workflow exports

## Security Checklist
- [ ] SSL certificates configured
- [ ] Database access restricted
- [ ] API rate limiting implemented
- [ ] User input validation
- [ ] Secure credential storage
- [ ] Regular security updates

## Cost Optimization
- Monitor DigitalOcean usage
- Optimize video generation costs
- Implement usage-based billing
- Set up alerts for high usage

Your SAAS is now ready to transform ideas into social media videos at scale!