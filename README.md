# HundredPath 🎯

A strategic 10×10 grid puzzle game where players navigate from 1 to 100 following unique movement rules. Challenge yourself in Tutorial mode or compete globally in Ranked mode!

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🎮 About

HundredPath is a logic-based puzzle game that tests your strategic thinking and problem-solving skills. Navigate through a 10×10 grid by jumping 2 squares horizontally or 1 square diagonally to reach 100 in the shortest time possible.

**Live Demo:** [https://hundredpath.simonecamerano.dev](https://hundredpath.simonecamerano.dev)

## ✨ Features

- **Tutorial Mode** - Learn the rules with visual aids and step-by-step guidance
- **Ranked Mode** - Compete for the fastest completion time on global leaderboards
- **Multiple Leaderboards** - Daily, weekly, and all-time rankings
- **User Profiles** - Track your best scores and achievements
- **Responsive Design** - Seamless experience on desktop and mobile devices
- **Guest Mode** - Try the tutorial without registration

## 🚀 Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official routing library
- **Pinia** - State management
- **Axios** - HTTP client
- **Lucide Vue** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Clone Repository
```bash
git clone https://github.com/yourusername/HundredPath.git
cd HundredPath
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start backend server
npm start
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env file (optional for local development)
echo "VITE_API_URL=http://localhost:3000" > .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Game Rules

1. Start at square **1**
2. Move by **jumping 2 squares horizontally** or **1 square diagonally**
3. Visit all numbers in sequence from 1 to 100
4. Complete the path in the **shortest time** possible

**Movement Examples:**
- From square 5: Can jump to 7, 9, 14, or 16
- Diagonal moves: Up-left, up-right, down-left, down-right

## 🏗️ Project Structure

```
HundredPath/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Authentication middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── scripts/        # Utility scripts
│   └── server.js       # Express server
├── frontend/
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── assets/     # Images, fonts
│   │   ├── components/ # Vue components
│   │   ├── composables/# Reusable logic
│   │   ├── services/   # API service
│   │   ├── stores/     # Pinia stores
│   │   ├── styles/     # CSS files
│   │   ├── views/      # Page components
│   │   └── router.js   # Vue Router config
│   └── vite.config.js  # Vite configuration
└── DEPLOYMENT.md       # Deployment guide
```

## 🌐 Deployment

Frontend and backend are deployed together as a single container on Coolify, so the
pages and the API share one domain and no external service delivers the site to users.
See [DEPLOYMENT.md](DEPLOYMENT.md) for the full procedure.

### Quick Deploy

1. Push to `main`
2. Coolify builds the root `Dockerfile`: it compiles the frontend, then copies `dist`
   into the backend image as `public/`
3. Express serves the static files and the API under `/api` on the same origin
4. Set the environment variables (MongoDB URI, JWT secret) on the Coolify resource

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Simone**

## 🙏 Acknowledgments

- Inspired by classic logic puzzles and strategic games
- Built as a learning project for full-stack development

---

**Note:** This is an alpha release running on free hosting. The first request may take up to 60 seconds as the server wakes up from sleep.
