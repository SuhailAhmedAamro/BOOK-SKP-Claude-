# Physical AI RAG Chatbot Backend

FastAPI backend with RAG (Retrieval-Augmented Generation) for the Physical AI & Humanoid Robotics textbook.

## Features

- ✅ JWT-based authentication
- ✅ User profiles (Software/Hardware background)
- ✅ RAG chatbot with Cohere + Qdrant
- ✅ Personalized responses based on user profile
- ✅ Urdu translation support
- ✅ Chapter progress tracking
- ✅ Chat history

## Tech Stack

- **Framework:** FastAPI 0.115+
- **Database:** Neon Postgres (serverless)
- **Vector DB:** Qdrant Cloud
- **LLM:** Cohere (command-r-plus + embed-english-v3.0)
- **Deployment:** Vercel (Python runtime)

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
DATABASE_URL=your_neon_postgres_url
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
COHERE_API_KEY=your_cohere_api_key
SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:3000
```

### 3. Initialize Database

Run the SQL script to create tables:

```bash
# Using psql
psql $DATABASE_URL < scripts/init_db.sql

# Or manually execute the SQL in Neon Console
```

### 4. Ingest Book Chapters

Generate embeddings and upload to Qdrant:

```bash
python scripts/ingest_chapters.py
```

This will:
- Read all chapters from `frontend/docs/BOOK/`
- Generate Cohere embeddings
- Upload vectors to Qdrant collection `robotics_textbook`

### 5. Run Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### User Profile
- `POST /api/user/profile` - Create/update profile (Software/Hardware)
- `GET /api/user/profile` - Get user profile
- `POST /api/user/progress` - Update chapter progress
- `GET /api/user/progress` - Get user progress

### Chat
- `POST /api/chat` - Send message to RAG chatbot
- `GET /api/chat/history?session_id=xyz` - Get chat history
- `POST /api/chat/translate` - Translate to Urdu

### Health
- `GET /` - API health check
- `GET /api/health` - Detailed health check

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Configure Environment Variables

In Vercel dashboard, add:
- `DATABASE_URL`
- `QDRANT_URL`
- `QDRANT_API_KEY`
- `COHERE_API_KEY`
- `SECRET_KEY`

### 3. Deploy

```bash
vercel --prod
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── auth/               # Authentication
│   │   ├── routes.py
│   │   ├── models.py
│   │   └── utils.py
│   ├── user/               # User profiles & progress
│   │   ├── routes.py
│   │   └── models.py
│   ├── chat/               # RAG chatbot
│   │   ├── routes.py
│   │   ├── models.py
│   │   └── rag_service.py
│   └── db/                 # Database clients
│       ├── neon.py
│       └── qdrant.py
├── scripts/
│   ├── init_db.sql
│   └── ingest_chapters.py
├── requirements.txt
└── vercel.json
```

## License

MIT
