# Poll Rooms - Complete Setup Guide

This guide will walk you through setting up the Poll Rooms application from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Setup](#mongodb-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Node.js** (v18+): [Download](https://nodejs.org/)
- **MongoDB** (v5+): [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **Git**: [Download](https://git-scm.com/)
- **Code Editor**: VS Code recommended

### Verify Installation
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
mongod --version  # Should show v5.x.x or higher (if using local)
```

## MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB Community Edition**
   - Download from [MongoDB Downloads](https://www.mongodb.com/try/download/community)
   - Follow OS-specific installation instructions

2. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   # Start MongoDB as a service from Services panel
   ```

3. **Verify MongoDB is Running**
   ```bash
   mongosh
   # Should connect to mongodb://localhost:27017
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free Shared" tier
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set role to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP address

5. **Get Connection String**
   - Go to "Database" > "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/poll-rooms`

## Backend Setup

### Step 1: Navigate to Server Directory
```bash
cd poll-rooms/server
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- express - Web framework
- mongoose - MongoDB ODM
- socket.io - Real-time communication
- cors - Cross-origin resource sharing
- dotenv - Environment variables
- helmet - Security headers
- express-rate-limit - Rate limiting

### Step 3: Configure Environment Variables

Edit the `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/poll-rooms

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/poll-rooms

# CORS Configuration
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_MAX=100
```

### Step 4: Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
╔════════════════════════════════════════════╗
║   🚀 Poll Rooms Server Running             ║
║   Port:        5000                        ║
║   Environment: development                 ║
║   URL:         http://localhost:5000       ║
╚════════════════════════════════════════════╝
```

### Step 5: Test the API

```bash
# Health check
curl http://localhost:5000/health

# Expected response:
# {"status":"OK","timestamp":"2024-xx-xx...","uptime":...}
```

## Frontend Setup

### Step 1: Navigate to Client Directory
```bash
cd poll-rooms/client
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- react - UI framework
- react-router-dom - Routing
- socket.io-client - Real-time client
- axios - HTTP client
- @fingerprintjs/fingerprintjs - Browser fingerprinting
- lucide-react - Icons
- tailwindcss - CSS framework

### Step 3: Configure Environment Variables

Edit the `.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 4: Start the Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 5: Open in Browser

Navigate to `http://localhost:5173`

You should see the Poll Rooms homepage!

## Testing

### Manual Testing Checklist

#### 1. Create a Poll
- [ ] Open `http://localhost:5173`
- [ ] Enter a question: "What's your favorite color?"
- [ ] Add options: "Red", "Blue", "Green"
- [ ] Click "Create Poll"
- [ ] Should redirect to poll page with shareable link

#### 2. Share and Vote
- [ ] Copy the poll URL
- [ ] Open in another browser tab or incognito window
- [ ] Select an option
- [ ] Click "Submit Vote"
- [ ] Should see results page

#### 3. Real-Time Updates
- [ ] Keep both browser windows open
- [ ] Vote from second window
- [ ] First window should update automatically
- [ ] Vote count should increase in real-time

#### 4. Anti-Abuse Testing
- [ ] Try to vote again from same browser
- [ ] Should see "You have already voted" error
- [ ] Try from incognito/different IP to verify new vote works

#### 5. Persistence Testing
- [ ] Create a poll
- [ ] Restart the server
- [ ] Poll should still be accessible via link
- [ ] Votes should be preserved

### API Testing with curl

```bash
# Create a poll
curl -X POST http://localhost:5000/api/polls \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Test Poll?",
    "options": ["Option A", "Option B"]
  }'

# Get poll (replace SHARELINK with actual link from creation)
curl http://localhost:5000/api/polls/SHARELINK

# Vote on poll
curl -X POST http://localhost:5000/api/polls/SHARELINK/vote \
  -H "Content-Type: application/json" \
  -d '{
    "optionIndex": 0,
    "fingerprint": "test123"
  }'
```

## Deployment

### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Choose the server directory

3. **Add MongoDB**
   - Click "New Service"
   - Choose "MongoDB"
   - Railway will provide connection string

4. **Set Environment Variables**
   - Go to project settings
   - Add variables:
     ```
     MONGODB_URI=<from Railway MongoDB service>
     CLIENT_URL=<your frontend URL>
     NODE_ENV=production
     ```

5. **Deploy**
   - Railway auto-deploys on push
   - Note your deployment URL

### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `client`

3. **Configure Build**
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Set Environment Variables**
   ```
   VITE_API_URL=<your Railway backend URL>/api
   VITE_SOCKET_URL=<your Railway backend URL>
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy
   - Note your deployment URL

6. **Update Backend CORS**
   - Update `CLIENT_URL` in Railway to your Vercel URL

## Troubleshooting

### Server Won't Start

**Error: `MongoDB connection failed`**
```bash
# Check MongoDB is running
mongosh

# If using Atlas, verify:
# - Connection string is correct
# - Password has no special characters (or is URL-encoded)
# - IP whitelist includes your IP
```

**Error: `Port 5000 already in use`**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or use different port
# Change PORT in .env to 5001
```

### Frontend Issues

**Error: `Network Error` when creating poll**
```bash
# Check backend is running
curl http://localhost:5000/health

# Verify VITE_API_URL in client/.env
echo $VITE_API_URL
```

**Socket.IO not connecting**
```bash
# Check browser console for errors
# Verify VITE_SOCKET_URL matches server
# Check CORS settings in server/server.js
```

### Real-Time Updates Not Working

1. Open browser DevTools → Network tab
2. Look for WebSocket connection
3. Should see `ws://localhost:5000/socket.io/...`
4. If failing, check:
   - Server is running
   - CORS configuration
   - Firewall settings

### Database Issues

**Can't see polls in MongoDB**
```bash
# Connect to MongoDB
mongosh

# Switch to database
use poll-rooms

# List collections
show collections

# View polls
db.polls.find().pretty()
```

## Next Steps

1. **Customize the UI**
   - Edit colors in `tailwind.config.js`
   - Modify components in `client/src/components/`

2. **Add Features**
   - Multiple choice voting
   - Poll expiration settings
   - Results export
   - User authentication

3. **Performance Optimization**
   - Add Redis for caching
   - Implement database indexing
   - Add CDN for static assets

4. **Monitoring**
   - Add logging (Winston, Pino)
   - Error tracking (Sentry)
   - Analytics (Google Analytics)

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review the main README.md
3. Check server and browser console logs
4. Verify all environment variables are set correctly

Happy polling! 🎉
