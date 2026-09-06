#!/bin/bash
# Ruko Deployment Script for Ubuntu

echo "🚀 Starting Ruko deployment on Ubuntu..."

# 1. Update system and install Node.js (if not installed)
if ! command -v node &> /dev/null
then
    echo "📦 Node.js not found. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js installed!"
else
    echo "✅ Node.js is already installed."
fi

# 2. Install PM2 globally (for keeping the app alive)
if ! command -v pm2 &> /dev/null
then
    echo "📦 Installing PM2 globally..."
    sudo npm install pm2 -g
else
    echo "✅ PM2 is already installed."
fi

# 3. Install ffmpeg (required for downloading M3U8 streams to BunnyCDN)
if ! command -v ffmpeg &> /dev/null
then
    echo "📦 Installing FFmpeg..."
    sudo apt-get update
    sudo apt-get install -y ffmpeg
else
    echo "✅ FFmpeg is already installed."
fi

# 4. Unzip and setup the app
echo "📂 Setting up application directory..."
mkdir -p /var/www/ruko
cp -R ./* /var/www/ruko/
cd /var/www/ruko/server

# 5. Install Node dependencies
echo "📦 Installing server dependencies..."
npm install

# 5.5 Auto-configure Quickplay Key
echo "🔑 Applying Quickplay API Secret..."
node scripts/set-quickplay-key.js

# 6. Start the server with PM2
echo "🚀 Starting Ruko server with PM2..."
pm2 stop ruko-server 2>/dev/null || true
pm2 start src/index.js --name ruko-server

# 7. Save PM2 state to start on reboot
pm2 save
pm2 startup | tail -n 1 | bash || true

echo ""
echo "========================================="
echo "🎉 Ruko deployment complete!"
echo "📡 Admin Panel: http://<your-server-ip>:3000/admin/"
echo "⚙️  Don't forget to configure BunnyCDN in the Settings tab!"
echo "========================================="
