# HundredPath Deployment Guide

## 📋 Prerequisites

- GitHub account
- Vercel account (connect with GitHub)
- Render account (free tier)
- MongoDB Atlas account (free tier)

---

## 1️⃣ Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere for Render)
5. Get connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/hundredpath?retryWrites=true&w=majority`
6. Replace `<username>` and `<password>` with your credentials

---

## 2️⃣ Deploy Backend on Render

1. Go to [Render](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `hundredpath-backend`
   - **Region**: Frankfurt (Europe)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<generate_a_random_32_character_string>
   FRONTEND_URL=https://your-app.vercel.app
   ```

6. Click **Create Web Service**
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://hundredpath-backend.onrender.com`

**⚠️ Important**: Free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~1 minute.

---

## 3️⃣ Deploy Frontend on Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://hundredpath-backend.onrender.com
   ```

6. Click **Deploy**
7. Wait for deployment (2-3 minutes)
8. Your app is live at: `https://your-app.vercel.app`

---

## 4️⃣ Update Configuration

### Update Backend CORS
Go back to Render → Environment → Update `FRONTEND_URL`:
```
FRONTEND_URL=https://your-app.vercel.app
```
(Replace with your actual Vercel domain)

### Update Frontend Meta Tags
Update `/frontend/index.html` Open Graph URLs:
```html
<meta property="og:url" content="https://your-app.vercel.app/" />
<meta property="og:image" content="https://your-app.vercel.app/hundredpath-og.png" />
<link rel="canonical" href="https://your-app.vercel.app/" />
```

---

## 5️⃣ Custom Domain (Optional)

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your domain: `hundredpath.com`
3. Configure DNS records as instructed by Vercel

### Render (Backend)
1. Keep using `onrender.com` subdomain (recommended for API)
2. Or add custom domain in Render settings

---

## 🧪 Testing Deployment

1. **Test Backend**: `https://your-backend.onrender.com/api/health`
2. **Test Frontend**: Open your Vercel URL
3. **Test Registration**: Create new account
4. **Test Game**: Play a game and check leaderboard
5. **Test Social Sharing**: Use [Facebook Debugger](https://developers.facebook.com/tools/debug/)

---

## 🔧 Troubleshooting

### Backend returns 502/503
- Render free tier is sleeping → wait 1 minute for wake up
- Check Render logs for errors

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel environment variables
- Verify CORS `FRONTEND_URL` in Render

### Database connection fails
- Check MongoDB Atlas IP whitelist
- Verify connection string credentials
- Check Render logs for MongoDB errors

### Images not loading
- Ensure `hundredpath-og.png` is in `/frontend/public/`
- Check browser console for 404 errors

---

## 📊 Monitoring

- **Render Logs**: Real-time backend logs
- **Vercel Analytics**: Page views and performance
- **MongoDB Atlas**: Database metrics and queries

---

## 💰 Costs

- **MongoDB Atlas M0**: Free forever (512MB storage)
- **Render Free Tier**: Free (750 hours/month, sleeps after 15min)
- **Vercel Hobby**: Free (100GB bandwidth/month)

**Total: €0/month** 🎉

---

## 🚀 Continuous Deployment

Both Vercel and Render auto-deploy on git push to main:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel and Render will automatically rebuild and deploy! ✅
