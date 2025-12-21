# 🤖 Physical AI & Humanoid Robotics Portal

<div align="center">

![Physical AI Portal](https://img.shields.io/badge/Physical%20AI-Portal-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-Proprietary-red?style=for-the-badge)

**An interactive educational platform for mastering Physical AI, ROS 2, and Humanoid Robotics**

[Live Demo](#) | [Documentation](./IMPLEMENTATION_COMPLETE.md) | [Quick Start](#quick-start)

</div>

---

## ✨ Features

### 🎓 **Educational Content**
- **13-Week Curriculum**: Comprehensive robotics course from basics to advanced
- **LaTeX Support**: Mathematical equations rendered beautifully with KaTeX
- **Mermaid Diagrams**: Visual learning with flowcharts and architecture diagrams
- **Bilingual**: Full English/Urdu translation support

### 🔐 **Modern Authentication**
- **Beautiful UI**: Glassmorphism design with smooth animations
- **JWT-Based Auth**: Secure token-based authentication
- **Profile Selection**: Software vs Hardware learning paths
- **Password Strength Indicator**: Real-time password validation

### 🤖 **RAG-Powered AI Chatbot**
- **Context-Aware**: Understands course content using Cohere embeddings
- **Personalized Responses**: Tailored to Software/Hardware background
- **Text Selection**: Select any text and ask "What is this?"
- **Source Citations**: Shows exact chapter/section references
- **Urdu Translation**: Translate any chapter to Urdu instantly

### 🎨 **User Experience**
- **Floating Chat Widget**: Always accessible, keyboard shortcut: `Ctrl/Cmd + K`
- **Dark Mode**: Beautiful in both light and dark themes
- **Mobile Responsive**: Works perfectly on all devices
- **Progress Tracking**: Monitor learning journey

---

## 📸 Screenshots

### Sign In Page
- Glassmorphism card with animated background blobs
- Password visibility toggle
- Email validation with icons

### Sign Up Page
- Live password strength indicator
- Optional name field
- Smooth error animations

### Profile Selection Modal
- Beautiful Software/Hardware choice cards
- Animated checkmarks
- Hover effects and transitions

### Chat Interface
- Floating widget with expand/collapse
- Message history
- Source citations with chapter references

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Docusaurus)                    │
│  React 19 + TypeScript + Tailwind CSS + Glassmorphism       │
│                Port: 3000 or 3001                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS/REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Backend (FastAPI)                          │
│  Python 3.11 + JWT Auth + RAG Service                       │
│                   Port: 8000                                 │
└────────┬──────────────────────┬───────────────────────────┘
         │                      │
         ▼                      ▼
┌────────────────┐    ┌─────────────────────┐
│  Neon Postgres │    │   Qdrant Cloud      │
│  (User Data)   │    │  (Vector Search)    │
└────────────────┘    └─────────────────────┘
         │                      │
         └──────────┬───────────┘
                    │
                    ▼
           ┌────────────────┐
           │   Cohere API   │
           │  (Embeddings   │
           │  + Generation) │
           └────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://www.python.org/))
- **Git** ([Download](https://git-scm.com/))

### Installation

#### 1. Clone Repository

```bash
git clone <your-repo-url>
cd Q-4-01
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

Start development server:
```bash
npm start
# Or if port 3000 is busy:
npm start -- --port 3001
```

#### 3. Backend Setup

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create `.env` file:
```env
DATABASE_URL=postgresql://neondb_owner:<password>@ep-patient-wave-ahpat21m.us-east-1.aws.neon.tech/neondb
QDRANT_URL=https://d9591c7e-519d-4674-b8ed-d57bf9fdd2d1.europe-west3-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.va4QEe4M-ypgWcLQlD0IhNEyV4LOFqzpDin1JcQBtdE
COHERE_API_KEY=Cy1EaVXLQepJBtkpPmFOalYMNCoL63RmiPYhlwhB
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

Initialize database:
```bash
psql $DATABASE_URL -f scripts/init_db.sql
```

Ingest chapter data:
```bash
python scripts/ingest_chapters.py
```

Start backend server:
```bash
uvicorn app.main:app --reload
```

#### 4. Access the App

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📁 Project Structure

```
Q-4-01/
├── frontend/                      # Docusaurus Frontend
│   ├── docs/
│   │   └── BOOK/                 # 13 chapters of curriculum
│   │       ├── 01-intro.md
│   │       ├── 02-ros2-basics.md
│   │       └── ...
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # 🎨 Beautiful Auth UI
│   │   │   │   ├── SignInForm.tsx
│   │   │   │   ├── SignUpForm.tsx
│   │   │   │   └── ProfileSelectionModal.tsx
│   │   │   ├── chat/            # 💬 Chat Components
│   │   │   │   ├── ChatWidget.tsx
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   └── SelectionButton.tsx
│   │   │   └── common/          # Shared Components
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx
│   │   │   ├── useChat.ts
│   │   │   └── useSelection.ts
│   │   ├── services/
│   │   │   └── api.ts           # API client
│   │   ├── utils/
│   │   │   └── env.ts           # Environment validation
│   │   ├── pages/
│   │   │   ├── index.tsx        # Homepage
│   │   │   └── auth/
│   │   │       ├── signin.tsx
│   │   │       └── signup.tsx
│   │   └── theme/               # Docusaurus theme overrides
│   │       └── Root.tsx
│   ├── docusaurus.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                       # FastAPI Backend
│   ├── app/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── config.py            # Environment config
│   │   ├── auth/
│   │   │   └── routes.py        # Auth endpoints
│   │   ├── chat/
│   │   │   ├── routes.py        # Chat endpoints
│   │   │   ├── rag_service.py   # 🤖 RAG Logic
│   │   │   └── personalization.py
│   │   ├── middleware/
│   │   │   ├── rate_limit.py
│   │   │   └── security.py
│   │   └── utils/
│   │       └── logger.py
│   ├── scripts/
│   │   ├── init_db.sql          # Database schema
│   │   └── ingest_chapters.py   # Data ingestion
│   ├── requirements.txt
│   └── vercel.json              # Vercel config
│
├── IMPLEMENTATION_COMPLETE.md    # Full documentation
├── DEPLOY_NOW.md                 # Deployment guide
├── PRODUCTION_CHECKLIST.md       # Pre-launch checklist
├── QUICK_START.md                # 5-minute guide
└── README.md                     # This file
```

---

## 🎯 Usage

### Authentication Flow

1. **Visit Homepage**: http://localhost:3001
2. **Click "Explore The BOOK 📖"** → Redirects to sign in
3. **Sign Up**:
   - Enter email, password, name (optional)
   - Strong password indicator guides you
   - After signup → Choose Software or Hardware path
4. **Redirected to Chapter 1**

### Using the Chatbot

**Method 1: Global Widget**
- Click floating "💬 Ask AI" button (bottom-right)
- Or press `Ctrl/Cmd + K`
- Type your question
- Get personalized answers with source citations

**Method 2: Text Selection**
- Select any text in a chapter
- "Ask about this" button appears
- Click to open chat with selected context
- Get focused answers about that specific content

### Translating Content

- Click "Translate to Urdu" button at top of any chapter
- Content instantly translates while preserving technical terms (ROS 2, URDF, etc.)

---

## 🛠️ Development

### Run Tests

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
pytest tests/ -v
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend - No build needed (Python)
```

### Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=<your-neon-postgres-url>
QDRANT_URL=<your-qdrant-cluster-url>
QDRANT_API_KEY=<your-qdrant-api-key>
COHERE_API_KEY=<your-cohere-api-key>
JWT_SECRET=<your-secret-key>
```

---

## 🚀 Deployment

### Deploy to Vercel

**Complete guide**: [DEPLOY_NOW.md](./DEPLOY_NOW.md)

**Quick steps**:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   vercel --prod
   ```

3. **Deploy Frontend**:
   ```bash
   cd frontend
   # Update .env with production backend URL
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard

See [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for complete deployment checklist.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) | Full architecture & features |
| [DEPLOY_NOW.md](./DEPLOY_NOW.md) | Deployment guide |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Pre-launch checklist |
| [QUICK_START.md](./QUICK_START.md) | 5-minute setup |
| [FIXES.md](./FIXES.md) | Common errors & solutions |
| [RESTART_INSTRUCTIONS.md](./RESTART_INSTRUCTIONS.md) | Server restart guide |

---

## 🎨 Design Highlights

### Glassmorphism UI
- **Backdrop blur** for modern frosted glass effect
- **Gradient backgrounds** with animated blobs
- **Shadow layers** for depth perception
- **Smooth animations** on all interactions

### Color Palette
- **Primary**: Blue (#2563EB) to Purple (#7C3AED) gradients
- **Secondary**: Pink (#EC4899) to Purple gradients
- **Neutral**: Gray scale with opacity layers
- **Dark Mode**: Optimized with adjusted opacity

### Typography
- **Headings**: Bold, gradient text with `bg-clip-text`
- **Body**: Clean, readable gray tones
- **Icons**: Heroicons SVG library

---

## 🔧 Tech Stack

### Frontend
- **Framework**: Docusaurus 3.9.2
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.x
- **Icons**: Heroicons (SVG)
- **Animations**: CSS custom keyframes
- **Environment**: Vite (import.meta.env)

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11
- **Auth**: JWT (PyJWT + bcrypt)
- **Database**: Neon Postgres (asyncpg)
- **Vector DB**: Qdrant Cloud
- **AI**: Cohere (embed-english-v3.0 + command-r-plus)
- **Validation**: Pydantic v2

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Vercel (Python runtime)
- **Database**: Neon Serverless Postgres
- **Vector Search**: Qdrant Cloud
- **AI API**: Cohere

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

Copyright © 2025 Panaversity. All rights reserved.

---

## 💬 Support

- **Email**: support@panaversity.pk
- **Issues**: [GitHub Issues](https://github.com/your-org/Q-4-01/issues)
- **Documentation**: See `/docs` folder

---

<div align="center">

**Built with ❤️ for Robotics Learners**

[⬆ Back to Top](#-physical-ai--humanoid-robotics-portal)

</div>
