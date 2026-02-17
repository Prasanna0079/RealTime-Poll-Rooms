# Deployment Guide

This guide covers deploying Poll Rooms to various cloud platforms.

## Quick Deploy Options

### Option 1: Railway (Backend) + Vercel (Frontend) [Recommended]

**Pros:**
- Free tier available
- Auto-deployment from Git
- Easy MongoDB integration
- Great developer experience

**Setup Time:** ~10 minutes

### Option 2: Render (Full Stack)

**Pros:**
- Deploy both frontend and backend
- Free tier
- Built-in PostgreSQL/MongoDB options

**Setup Time:** ~15 minutes

### Option 3: AWS / DigitalOcean / Heroku

**Pros:**
- Full control
- Scalable
- Professional hosting

**Setup Time:** ~30 minutes

---

## Detailed Deployment Instructions

## Railway + Vercel Deployment

### Part 1: Deploy Backend to Railway

1. **Prerequisites:**
   - GitHub repository with your code
   - Railway account (sign up at railway.app)

2. **Create New Project:**
   ```
   1. Go to Railway Dashboard
   2. Click "New Project"
   3. Select "Deploy from GitHub repo"
   4. Choose your repository
   5. Select the server folder as root directory
   ```

3. **Add MongoDB:**
   ```
   1. In your project, click "New"
   2. Select "Database" → "Add MongoDB"
   3. Railway provisions a MongoDB instance
   4. Copy the connection string from variables tab
   ```

4. **Configure Environment Variables:**
   ```
   Go to project settings → Variables → Add:
   
   MONGODB_URI = <connection string from Railway MongoDB>
   CLIENT_URL = https://your-app.vercel.app (update after frontend deploy)
   NODE_ENV = production
   PORT = 5000
   RATE_LIMIT_MAX = 100
   ```

5. **Deploy:**
   ```
   Railway automatically deploys
   Note your deployment URL: https://your-app.railway.app
   ```

6. **Custom Domain (Optional):**
   ```
   Settings → Domains → Add custom domain
   Follow DNS configuration instructions
   ```

### Part 2: Deploy Frontend to Vercel

1. **Prerequisites:**
   - Vercel account (sign up at vercel.com)
   - Backend deployed and URL ready

2. **Import Project:**
   ```
   1. Go to Vercel Dashboard
   2. Click "New Project"
   3. Import your GitHub repository
   4. Set root directory to: client
   ```

3. **Configure Build Settings:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables:**
   ```
   VITE_API_URL = https://your-app.railway.app/api
   VITE_SOCKET_URL = https://your-app.railway.app
   ```

5. **Deploy:**
   ```
   Click "Deploy"
   Vercel builds and deploys automatically
   Note your URL: https://your-app.vercel.app
   ```

6. **Update Backend CORS:**
   ```
   Go back to Railway
   Update CLIENT_URL to your Vercel URL
   Redeploy if needed
   ```

---

## Render Deployment (Alternative)

### Backend Deployment

1. **Create Web Service:**
   ```
   1. Go to Render Dashboard
   2. New → Web Service
   3. Connect GitHub repository
   4. Configure:
      - Name: poll-rooms-api
      - Root Directory: server
      - Environment: Node
      - Build Command: npm install
      - Start Command: npm start
   ```

2. **Add Environment Variables:**
   ```
   MONGODB_URI = <your MongoDB Atlas connection>
   CLIENT_URL = <your frontend URL>
   NODE_ENV = production
   ```

3. **Create MongoDB:**
   ```
   Option A: Use Render's MongoDB (paid)
   Option B: Use MongoDB Atlas (free tier available)
   ```

### Frontend Deployment

1. **Create Static Site:**
   ```
   1. New → Static Site
   2. Connect repository
   3. Configure:
      - Name: poll-rooms
      - Root Directory: client
      - Build Command: npm run build
      - Publish Directory: dist
   ```

2. **Add Environment Variables:**
   ```
   VITE_API_URL = <your backend URL>/api
   VITE_SOCKET_URL = <your backend URL>
   ```

---

## Environment Variables Reference

### Backend (.env)
```env
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/poll-rooms
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production

# Optional
PORT=5000
RATE_LIMIT_MAX=100
```

### Frontend (.env)
```env
# Required
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
```

---

## MongoDB Atlas Setup (For Any Platform)

1. **Create Free Cluster:**
   ```
   1. Go to mongodb.com/cloud/atlas
   2. Sign up / Log in
   3. Create Free Tier Cluster (M0)
   4. Choose region closest to your server
   ```

2. **Create Database User:**
   ```
   Database Access → Add New User
   - Username: polluser
   - Password: <generate strong password>
   - Role: Read and write to any database
   ```

3. **Configure Network Access:**
   ```
   Network Access → Add IP Address
   - For testing: 0.0.0.0/0 (anywhere)
   - For production: Add your server IPs
   ```

4. **Get Connection String:**
   ```
   Database → Connect → Connect your application
   Copy connection string
   Replace <password> with your database password
   ```

---

## Post-Deployment Checklist

### ✅ Testing
- [ ] Create a poll on production
- [ ] Share link works
- [ ] Voting works
- [ ] Real-time updates work
- [ ] Anti-abuse (can't vote twice)
- [ ] Results display correctly

### ✅ Security
- [ ] HTTPS enabled (auto on Vercel/Railway)
- [ ] CORS configured for production URL only
- [ ] Rate limiting active
- [ ] MongoDB access restricted to app IPs
- [ ] Environment variables secured

### ✅ Performance
- [ ] Frontend builds optimized
- [ ] Static assets cached
- [ ] Database indexes created
- [ ] WebSocket connection stable

### ✅ Monitoring
- [ ] Check logs for errors
- [ ] Monitor database connections
- [ ] Track API response times
- [ ] Set up uptime monitoring

---

## Scaling Considerations

### When to Scale

**Backend:**
- > 100 concurrent users
- > 1000 polls created per day
- Socket.IO connections slow

**Database:**
- > 10,000 polls
- Query times > 100ms
- Storage > 512MB (free tier limit)

### Scaling Options

1. **Vertical Scaling:**
   - Upgrade Railway/Render plan
   - Increase MongoDB tier

2. **Horizontal Scaling:**
   - Add Redis for session management
   - Load balancer for multiple server instances
   - MongoDB replica sets

3. **Optimization:**
   - Add database indexes
   - Implement caching
   - CDN for static assets
   - Lazy loading on frontend

---

## Cost Estimation

### Free Tier (Railway + Vercel + Atlas)
- Railway: $5 credit/month (enough for hobby use)
- Vercel: Unlimited bandwidth on hobby tier
- MongoDB Atlas: 512MB free forever
- **Total: $0/month** for small scale

### Paid Tier (For production)
- Railway: ~$10-20/month
- Vercel Pro: $20/month
- MongoDB Atlas: ~$10-30/month
- **Total: ~$40-70/month**

---

## Troubleshooting Deployment

### Issue: Build Fails

**Check:**
```bash
# Locally verify build works
cd client
npm run build

cd ../server
npm install
```

### Issue: WebSocket Not Connecting

**Fix:**
```javascript
// Ensure backend allows WebSocket upgrade
// In server.js, Socket.IO CORS should include:
cors: {
  origin: process.env.CLIENT_URL,
  credentials: true
}
```

### Issue: Database Connection Timeout

**Check:**
1. MongoDB Atlas IP whitelist
2. Connection string format
3. Network connectivity
4. Database user permissions

### Issue: Environment Variables Not Loading

**Fix:**
```bash
# Verify on platform dashboard
# Railway: Project → Variables
# Vercel: Project Settings → Environment Variables
# Render: Environment → Environment Variables
```

---

## Rollback Strategy

If deployment fails:

1. **Vercel:**
   ```
   Deployments → Select previous deployment → Promote to Production
   ```

2. **Railway:**
   ```
   Deployments → Click on previous deployment → Redeploy
   ```

3. **Database:**
   ```
   MongoDB Atlas has automatic backups (paid tier)
   Free tier: No automatic backups
   ```

---

## Custom Domain Setup

### Vercel
```
1. Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)
```

### Railway
```
1. Project Settings → Domains
2. Generate domain or add custom
3. Update CNAME record
4. SSL automatic via Let's Encrypt
```

---

## Monitoring & Logs

### Railway Logs
```
Project → Deployments → Click deployment → View Logs
Real-time logs with filtering
```

### Vercel Logs
```
Project → Logs
Filter by deployment, function, or search
```

### MongoDB Logs
```
Atlas → Clusters → Metrics tab
View operations, connections, network
```

---

## Support Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Socket.IO Docs: https://socket.io/docs/v4

---

## Quick Commands Reference

```bash
# Check deployment status
git push origin main  # Triggers auto-deploy

# View logs locally
npm run dev --prefix server  # Server logs
npm run dev --prefix client  # Client logs

# Build for production
npm run build --prefix client

# Test production build locally
cd client/dist
npx serve
```

---

That's it! Your Poll Rooms application should now be live and accessible worldwide. 🚀
