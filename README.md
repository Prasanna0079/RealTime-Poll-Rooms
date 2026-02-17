# Poll Rooms - Real-Time Polling Application

A full-stack real-time polling application built with the MERN stack. Create polls, share them via link, and watch results update in real-time for all viewers.

## 🌟 Features

### ✅ Required Features (Success Criteria)

1. **Poll Creation**
   - Create polls with a question and at least 2 options
   - Automatically generate shareable links
   - Support up to 10 options per poll

2. **Join by Link**
   - Anyone with the share link can view and vote
   - Single-choice voting system
   - No authentication required

3. **Real-Time Results**
   - Live updates using Socket.IO
   - Results update automatically for all viewers
   - No manual page refresh needed

4. **Fairness / Anti-Abuse**
   - **IP-based tracking**: Prevents repeat voting from same IP address
   - **Browser fingerprinting**: Additional layer using FingerprintJS
   - Dual protection ensures one vote per person
   - Known limitations: VPNs and browser clearing can bypass

5. **Persistence**
   - MongoDB database stores all polls and votes
   - Polls auto-delete after 30 days (MongoDB TTL)
   - Share links remain valid throughout poll lifetime

6. **Deployment**
   - Production-ready configuration
   - Environment-based settings
   - Can be deployed to any Node.js hosting platform

## 🛡️ Anti-Abuse Mechanisms Explained

### Two-Layer Protection:

1. **IP Address Tracking**
   - Captures client IP from request headers
   - Prevents multiple votes from same IP
   - Effective for most users on stable connections

2. **Browser Fingerprinting** (FingerprintJS)
   - Creates unique identifier based on browser/device characteristics
   - Works across IP changes (mobile users, VPN users)
   - Adds extra protection layer

### Enforcement:
- Both IP and fingerprint are checked before allowing vote
- Vote is blocked if either identifier has already voted
- Error message shown to users who try to vote twice

### Known Limitations:
- Users can bypass by using VPN + clearing browser data
- Incognito/private browsing creates new fingerprints
- These are acceptable trade-offs for a simple, no-authentication system

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Socket.IO Client** - Real-time updates
- **React Router** - Navigation
- **Axios** - HTTP client
- **FingerprintJS** - Browser fingerprinting

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket communication
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting

## 📁 Project Structure

```
poll-rooms/
├── server/                 # Backend application
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/
│   │   └── Poll.js        # Poll schema with anti-abuse methods
│   ├── routes/
│   │   └── polls.js       # API endpoints
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── .env               # Environment variables
│   ├── server.js          # Express + Socket.IO server
│   └── package.json
│
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreatePoll.jsx      # Poll creation form
│   │   │   ├── PollView.jsx        # Voting interface
│   │   │   ├── PollResults.jsx     # Real-time results display
│   │   │   └── ShareLink.jsx       # Share functionality
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page
│   │   │   └── Poll.jsx            # Poll view page
│   │   ├── services/
│   │   │   └── api.js              # API client + fingerprinting
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Tailwind + custom styles
│   ├── .env               # Environment variables
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json
│
└── README.md              # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd poll-rooms
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your settings:
# - MONGODB_URI (use MongoDB Atlas for cloud deployment)
# - PORT (default: 5000)
# - CLIENT_URL (default: http://localhost:5173)

# Start MongoDB (if using local)
# mongod

# Start the server
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Configure environment variables
# Edit .env file if needed:
# - VITE_API_URL (default: http://localhost:5000/api)
# - VITE_SOCKET_URL (default: http://localhost:5000)

# Start the development server
npm run dev
```

The client will run on `http://localhost:5173`

### 4. Test the Application

1. Open `http://localhost:5173` in your browser
2. Create a poll with a question and options
3. Click "Create Poll" to generate a shareable link
4. Copy the link and open it in another browser/tab
5. Vote on the poll and watch results update in real-time!

## 🌐 API Endpoints

### POST `/api/polls`
Create a new poll
```json
{
  "question": "What's your favorite programming language?",
  "options": ["JavaScript", "Python", "Go", "Rust"]
}
```

### GET `/api/polls/:shareLink`
Get poll details and check if user has voted

### POST `/api/polls/:shareLink/vote`
Submit a vote
```json
{
  "optionIndex": 0,
  "fingerprint": "abc123..."
}
```

### GET `/api/polls/:shareLink/results`
Get poll results

## 🔌 Socket.IO Events

### Client → Server
- `joinPoll` - Join a poll room to receive real-time updates
- `leavePoll` - Leave a poll room

### Server → Client
- `voteUpdate` - Broadcast when a new vote is submitted
  ```json
  {
    "pollId": "...",
    "options": [...],
    "totalVotes": 42
  }
  ```

## 🚀 Deployment

### Backend Deployment (Railway / Render / Heroku)

1. **Set Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/poll-rooms
   CLIENT_URL=https://your-frontend-domain.com
   PORT=5000
   NODE_ENV=production
   ```

2. **Deploy:**
   - Push to GitHub
   - Connect repository to hosting platform
   - Platform will auto-detect Node.js and install dependencies
   - Server will start with `npm start`

### Frontend Deployment (Vercel / Netlify)

1. **Set Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   VITE_SOCKET_URL=https://your-backend-domain.com
   ```

2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Deploy:**
   - Connect repository
   - Platform will build and deploy automatically

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (or allow from anywhere for testing)
5. Get connection string and update `MONGODB_URI`

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Configured for specific origins
- **Rate Limiting** - Prevents API abuse (100 requests/15 min)
- **Input Validation** - Server-side validation for all inputs
- **MongoDB Injection Protection** - Mongoose sanitizes queries
- **IP & Fingerprint Tracking** - Anti-abuse voting protection

## 📊 Database Schema

### Poll Model
```javascript
{
  question: String,           // Poll question
  options: [{
    text: String,            // Option text
    votes: Number            // Vote count
  }],
  shareLink: String,         // Unique identifier
  votedIPs: [{              // IP-based tracking
    ip: String,
    votedAt: Date,
    optionIndex: Number
  }],
  votedFingerprints: [{     // Fingerprint-based tracking
    fingerprint: String,
    votedAt: Date,
    optionIndex: Number
  }],
  createdAt: Date,          // Auto-expires after 30 days
  isActive: Boolean
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: Verify IP whitelist and credentials

### Socket.IO Not Connecting
- Check CORS settings in `server.js`
- Verify `CLIENT_URL` in backend `.env`
- Check `VITE_SOCKET_URL` in frontend `.env`

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Built as a full-stack coding assignment demonstrating:
- RESTful API design
- Real-time WebSocket communication
- Database modeling and optimization
- React component architecture
- Modern UI/UX design
- Production deployment practices

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.
