# Flag Quiz Master

A fast-paced geography trivia game that challenges players to identify world flags, track streaks, and climb the leaderboard. The app pairs a polished Tailwind UI with a custom Express API that keeps the flag options fresh and prevents quick repeats, making every run feel like a world tour.


---

## ✨ Features

- **Quiz modes:** Sprint (10), Marathon (20), Legend (30) – each worth one point per question.
- **Smart question engine:** Backend tracks recently used flags so you won’t see repeats for 6–7 questions.
- **Multiple-choice + input:** Guess by typing or pick from the auto-generated options.
- **Dynamic scoring HUD:** Real-time score, question number, accuracy, and a progress bar.
- **Responsive & themed UI:** Tailwind-powered neon arena aesthetic with animated feedback.
- **Deployment-ready:** Frontend served from Netlify, backend hosted on Render with CORS configured for both dev and prod.

---

## 🛠 Tech Stack

| Layer     | Tools |
|-----------|-------|
| Frontend  | React 19 + Vite, React Router, Tailwind (via CDN) |
| Backend   | Node.js, Express 5, CORS middleware, node-fetch |
| Data      | Flag CDN (`codes.json`, PNG assets) |
| Hosting   | Netlify (frontend), Render (backend) |
| Tooling   | ESLint, npm scripts |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd web_game

# frontend
cd frontend
npm install
cd ..

# backend
cd backend
npm install
```

### 2. Run locally

```bash
# backend (port 3000)
cd backend
npm run dev

# frontend (port 5173)
cd ../frontend
npm run dev
```

Visit `http://localhost:5173`. The frontend auto-detects localhost and talks to `http://localhost:3000`.

---

## 🔧 Environment / Config

The frontend falls back to sensible defaults, but you can override them:

```bash
# frontend/.env.development
VITE_API_BASE_URL=http://localhost:3000

# frontend/.env.production
VITE_API_BASE_URL=https://web-flag-game-backend.onrender.com
```

Backend CORS origins live in `backend/server.js`; update the array when adding new deployment domains.

---

## 📦 Building & Deploying

### Frontend (Netlify)

```bash
cd frontend
npm run build        # outputs to dist/
```

- Drag `dist/` into Netlify’s manual deploy UI **or**
- `netlify deploy --prod --dir=dist`


### Backend (Render)

```bash
cd backend
npm start            # Render runs this in production
```

Ensure `origin` in `server.js` includes both `http://localhost:5173` and your Netlify domain.

---
    ├── src/
    │   ├── pages/Game.jsx
    │   ├── pages/Home.jsx
    │   └── ...
    ├── public/
    └── package.json
