# Production Deployment Guide

## 🚀 NMBR Platform v2 - Production Deployment

### **Complete Step-by-Step Production Deployment Instructions**

---

## **📋 Pre-Deployment Checklist**

### **1. Environment Preparation**
- [ ] **Production Server** - Server provisioned and configured
- [ ] **Domain Name** - Production domain registered and configured
- [ ] **SSL Certificate** - SSL certificate obtained and ready
- [ ] **DNS Configuration** - DNS records configured
- [ ] **CDN Setup** - Content delivery network configured
- [ ] **Monitoring Tools** - Production monitoring tools configured
- [ ] **Backup System** - Backup system configured
- [ ] **Security Tools** - Security monitoring configured

### **2. Database Preparation**
- [ ] **Production Database** - Supabase production project created
- [ ] **Database Schema** - Schema deployed to production
- [ ] **RLS Policies** - Row-level security policies applied
- [ ] **Initial Data** - Seed data loaded if needed
- [ ] **Backup Configuration** - Database backup configured
- [ ] **Monitoring** - Database monitoring configured

### **3. External Services**
- [ ] **Stripe Production** - Stripe production account configured
- [ ] **Email Service** - Production email service configured
- [ ] **SMS Service** - SMS service configured if needed
- [ ] **Analytics** - Google Analytics configured
- [ ] **Error Tracking** - Sentry configured
- [ ] **CDN** - Content delivery network configured

---

## **🔧 Step 1: Server Setup**

### **1.1 Server Requirements**
\`\`\`bash
# Minimum Requirements
CPU: 2 cores
RAM: 4GB
Storage: 50GB SSD
OS: Ubuntu 20.04 LTS or later

# Recommended Requirements
CPU: 4 cores
RAM: 8GB
Storage: 100GB SSD
OS: Ubuntu 22.04 LTS
\`\`\`

### **1.2 Server Configuration**
\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
\`\`\`

### **1.3 Application Setup**
\`\`\`bash
# Create application directory
sudo mkdir -p /var/www/nmbr-platform
sudo chown -R $USER:$USER /var/www/nmbr-platform

# Clone repository
cd /var/www/nmbr-platform
git clone https://github.com/your-org/nmbr-platform-v2.git .

# Install dependencies
npm install

# Build application
npm run build
\`\`\`

---

## **🗄️ Step 2: Database Configuration**

### **2.1 Supabase Production Setup**
1. **Create Production Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project for production
   - Note down the project URL and API keys

2. **Database Schema Deployment**
   \`\`\`sql
   -- Run the production schema
   -- This includes all tables, RLS policies, and functions
   \`\`\`

3. **Environment Variables**
   \`\`\`bash
   # Add to .env.production
   NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
   SUPABASE_DB_URL=postgresql://postgres:password@db.your-production-project.supabase.co:5432/postgres
   \`\`\`

### **2.2 Database Security**
- **Enable RLS** - Row-level security enabled
- **Configure Policies** - All RLS policies applied
- **Audit Logging** - Database audit logging enabled
- **Backup Strategy** - Automated daily backups configured

---

## **🔐 Step 3: Security Configuration**

### **3.1 SSL Certificate**
\`\`\`bash
# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Verify certificate
sudo certbot certificates
\`\`\`

### **3.2 Nginx Configuration**
\`\`\`nginx
# /etc/nginx/sites-available/nmbr-platform
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    location / {
        proxy_pass http://localhost:3000;
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
\`\`\`

### **3.3 Enable Site**
\`\`\`bash
# Enable site
sudo ln -s /etc/nginx/sites-available/nmbr-platform /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
\`\`\`

---

## **⚙️ Step 4: Application Configuration**

### **4.1 Environment Variables**
\`\`\`bash
# Create production environment file
cat > .env.production << EOF
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_NAME=NMBR Platform
NEXT_PUBLIC_APP_VERSION=1.0.0

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
SUPABASE_DB_URL=postgresql://postgres:password@db.your-production-project.supabase.co:5432/postgres

# Stripe
STRIPE_SECRET_KEY=sk_live_your-production-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-production-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-production-webhook-secret

# Email
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=noreply@your-domain.com

# Monitoring
SENTRY_DSN=https://your-production-sentry-dsn@sentry.io/project-id
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX-PRODUCTION

# Security
JWT_SECRET=your-production-jwt-secret
ENCRYPTION_KEY=your-production-encryption-key
CSRF_SECRET=your-production-csrf-secret
SESSION_SECRET=your-production-session-secret

# Performance
REDIS_URL=redis://your-redis-instance:6379
CACHE_TTL=300000
CACHE_MAX_SIZE=10000

# Backup
BACKUP_S3_BUCKET=nmbr-platform-production-backups
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
EOF
\`\`\`

### **4.2 PM2 Configuration**
\`\`\`javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nmbr-platform',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/nmbr-platform',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/nmbr-platform-error.log',
    out_file: '/var/log/pm2/nmbr-platform-out.log',
    log_file: '/var/log/pm2/nmbr-platform.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
}
\`\`\`

### **4.3 Start Application**
\`\`\`bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
\`\`\`

---

## **📊 Step 5: Monitoring Setup**

### **5.1 System Monitoring**
\`\`\`bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Configure log rotation
sudo nano /etc/logrotate.d/nmbr-platform
\`\`\`

### **5.2 Application Monitoring**
- **Sentry** - Error tracking and performance monitoring
- **Google Analytics** - User analytics and behavior tracking
- **Uptime Monitoring** - Service availability monitoring
- **Performance Monitoring** - Application performance tracking

### **5.3 Database Monitoring**
- **Supabase Dashboard** - Database performance monitoring
- **Query Performance** - Slow query identification
- **Connection Monitoring** - Database connection tracking
- **Backup Monitoring** - Backup success verification

---

## **🔄 Step 6: Backup Configuration**

### **6.1 Database Backups**
\`\`\`bash
# Configure automated database backups
# This is handled by Supabase automatically
# Verify backup configuration in Supabase dashboard
\`\`\`

### **6.2 Application Backups**
\`\`\`bash
# Create backup script
cat > /usr/local/bin/backup-nmbr-platform.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/nmbr-platform"
APP_DIR="/var/www/nmbr-platform"

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C $APP_DIR .

# Keep only last 7 days of backups
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +7 -delete

echo "Backup completed: app_$DATE.tar.gz"
EOF

# Make executable
chmod +x /usr/local/bin/backup-nmbr-platform.sh

# Add to crontab
echo "0 2 * * * /usr/local/bin/backup-nmbr-platform.sh" | crontab -
\`\`\`

---

## **🧪 Step 7: Testing & Validation**

### **7.1 Health Checks**
\`\`\`bash
# Test application health
curl -f http://localhost:3000/api/health || exit 1

# Test database connection
curl -f http://localhost:3000/api/health/database || exit 1

# Test external services
curl -f http://localhost:3000/api/health/external || exit 1
\`\`\`

### **7.2 Performance Testing**
\`\`\`bash
# Run performance tests
npm run test:performance

# Run accessibility tests
npm run accessibility:test

# Run security tests
npm run security:audit
\`\`\`

### **7.3 User Acceptance Testing**
- **Registration Flow** - Test user registration
- **Donation Flow** - Test donation processing
- **Newsletter Flow** - Test newsletter subscription
- **Admin Functions** - Test admin dashboard
- **Mobile Testing** - Test on mobile devices

---

## **🚀 Step 8: Go Live**

### **8.1 DNS Configuration**
\`\`\`bash
# Update DNS records
# A record: your-domain.com -> server-ip
# CNAME record: www.your-domain.com -> your-domain.com
\`\`\`

### **8.2 Final Verification**
\`\`\`bash
# Check application status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check SSL certificate
sudo certbot certificates

# Test website
curl -I https://your-domain.com
\`\`\`

### **8.3 Monitoring Setup**
- **Enable Alerts** - Configure monitoring alerts
- **Setup Dashboards** - Create monitoring dashboards
- **Test Notifications** - Verify alert notifications
- **Documentation** - Update production documentation

---

## **📈 Step 9: Post-Deployment**

### **9.1 Performance Optimization**
\`\`\`bash
# Enable Gzip compression
# Configure caching headers
# Optimize images
# Setup CDN
\`\`\`

### **9.2 Security Hardening**
\`\`\`bash
# Update firewall rules
# Configure fail2ban
# Setup intrusion detection
# Regular security updates
\`\`\`

### **9.3 Monitoring & Maintenance**
- **Daily Health Checks** - Monitor system health
- **Weekly Performance Review** - Review performance metrics
- **Monthly Security Audit** - Security assessment
- **Quarterly Backup Test** - Test backup restoration

---

## **🆘 Troubleshooting**

### **Common Issues**

#### **Application Won't Start**
\`\`\`bash
# Check logs
pm2 logs nmbr-platform

# Check environment variables
pm2 env 0

# Restart application
pm2 restart nmbr-platform
\`\`\`

#### **Database Connection Issues**
\`\`\`bash
# Check database status
curl -f http://localhost:3000/api/health/database

# Check environment variables
grep SUPABASE .env.production

# Test database connection
npm run db:test
\`\`\`

#### **SSL Certificate Issues**
\`\`\`bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL
openssl s_client -connect your-domain.com:443
\`\`\`

#### **Performance Issues**
\`\`\`bash
# Check system resources
htop

# Check application logs
pm2 logs nmbr-platform

# Check database performance
npm run db:performance
\`\`\`

---

## **📞 Support & Maintenance**

### **Monitoring Contacts**
- **System Administrator** - Primary system admin
- **Database Administrator** - Database specialist
- **Security Team** - Security specialist
- **Development Team** - Application developers

### **Emergency Procedures**
1. **System Down** - Contact system administrator
2. **Security Breach** - Contact security team
3. **Data Loss** - Contact database administrator
4. **Performance Issues** - Contact development team

### **Regular Maintenance**
- **Daily** - Health checks and monitoring
- **Weekly** - Performance review and optimization
- **Monthly** - Security updates and patches
- **Quarterly** - Full system audit and backup testing

---

## **🎉 Deployment Complete!**

**Congratulations! The NMBR Platform v2 is now live in production!**

### **✅ Production Deployment Successful**
### **✅ All Systems Operational**
### **✅ Monitoring Active**
### **✅ Backups Configured**
### **✅ Security Implemented**
### **✅ Performance Optimized**

**The platform is ready to serve users and process donations! 🚀**
