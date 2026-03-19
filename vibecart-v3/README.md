# VibeCart — Setup Guide

## What's New in v3
- **Marketplace** — shared ads visible to ALL users in real-time
- **Sell page** — anyone can post a listing with photo, price, contact info
- **Backend API** — Node.js/Express server with JSON file database
- **Auth system** — real register/login with SHA-256 password hashing
- **Account dashboard** — orders, wishlist, profile settings

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm start
```

The server starts at **http://localhost:3000**

Open your browser → `http://localhost:3000`

---

## How it works

### Backend (`server/server.js`)
Express.js server that:
- Serves the frontend from `web/`
- Exposes a REST API at `/api/`
- Stores ads in `server/data/ads.json` (auto-created)
- Stores uploaded images in `server/data/uploads/`

### API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/ads` | List all active ads |
| GET | `/api/ads?category=electronics` | Filter by category |
| GET | `/api/ads?q=iphone` | Search ads |
| GET | `/api/ads/:id` | Get single ad |
| POST | `/api/ads` | Create new ad (multipart/form-data) |
| PATCH | `/api/ads/:id` | Update ad |
| DELETE | `/api/ads/:id` | Delete ad |
| POST | `/api/ads/:id/view` | Increment view count |
| GET | `/api/stats` | Platform stats |

### Auth system (`web/auth.js`)
- Users stored in browser `localStorage` (per-device)
- Passwords hashed with SHA-256 via Web Crypto API
- Sessions survive page reloads

### Ads database (`server/data/ads.json`)
- JSON file, automatically created on first run
- Persists between server restarts
- All users share the same ads

---

## File structure
```
vibecart-v3/
├── package.json
├── server/
│   ├── server.js          ← Express backend
│   └── data/
│       ├── ads.json       ← Auto-created on first run
│       └── uploads/       ← Uploaded images
└── web/
    ├── index.html         ← Homepage
    ├── shop.html          ← VibeCart product shop
    ├── marketplace.html   ← User-posted ads (shared)
    ├── sell.html          ← Post a new ad
    ├── login.html         ← Login / Sign up
    ├── account.html       ← User dashboard
    ├── auth.js            ← Auth backend (localStorage)
    ├── ads.js             ← Ads API client
    ├── shop.js            ← Shop page logic
    ├── script.js          ← Shared UI logic
    ├── style.css          ← Global styles
    ├── shop.css           ← Shop page styles
    └── login.css          ← Auth page styles
```

---

## Production deployment

To deploy on a real server (e.g. Railway, Render, VPS):

1. Set the `PORT` environment variable
2. For persistence, replace `server/data/ads.json` with a real database (MongoDB, PostgreSQL, SQLite)
3. For user auth, replace `localStorage` with server-side sessions + JWT tokens
4. Add HTTPS
5. Configure CORS to your domain

---

## Notes

- **Ads are shared** across all browsers/users because they're stored on the server
- **User accounts** are stored in `localStorage` — they're per-browser by design (no server-side users yet)
- **Images** are stored in `server/data/uploads/` — back this up if deploying
- The server auto-refreshes the marketplace every 30 seconds

---

VibeCart © 2026
