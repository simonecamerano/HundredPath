#!/bin/bash

# Deployment Script for HundredPath

echo "🚀 Starting Deployment..."

# 1. Pull latest changes
echo "📥 Pulling from git..."
git pull origin main

# 2. Backend Setup & Migration
echo "🛠️  Updating Backend..."
cd backend
npm install
echo "📦 Running Database Migration..."
node scripts/migrate-to-ranked.js
cd ..

# 3. Frontend Build
echo "🏗️  Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 4. Restart Services (PM2)
echo "🔄 Restarting Application..."
# Adjust the app name if needed (e.g., 'hundredpath-backend')
pm2 restart all

echo "✅ Deployment Complete!"
