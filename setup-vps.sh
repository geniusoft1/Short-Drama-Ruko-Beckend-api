#!/bin/bash
# =============================================
# RUKO ADMIN - CONTABO VPS SETUP SCRIPT
# Run this on your Ubuntu/Debian VPS
# =============================================

set -e
echo "🎬 Setting up Ruko Admin on Contabo VPS..."

# 1. Update system
apt update && apt upgrade -y

# 2. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Install PM2 for process management
npm install -g pm2

# 4. Install Nginx
apt install -y nginx

# 5. Copy files to server (run this from your local machine)
# scp -r ./ruko-admin root@YOUR_VPS_IP:/var/www/ruko-admin

# 6. Install dependencies
cd /var/www/ruko-admin/server
npm install --production

# 7. Initialize database
npm run init-db

# 8. Start with PM2
pm2 start src/index.js --name "ruko-admin"
pm2 save
pm2 startup

echo "✅ Ruko Admin server started!"
echo "   Admin panel: http://YOUR_VPS_IP:3000/admin/"
echo ""
echo "Now configure Nginx reverse proxy for port 80/443..."
