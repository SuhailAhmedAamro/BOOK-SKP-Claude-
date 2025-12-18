# Quickstart: Physical AI & Humanoid Robotics Portal

**Feature**: 001-robotics-portal
**Last Updated**: 2025-12-18

## Overview

This guide helps developers set up the Physical AI & Humanoid Robotics Portal on their local machine. The portal consists of:
- **Frontend**: Docusaurus v3 + TypeScript + Tailwind CSS (port 3000)
- **Backend**: FastAPI + Python 3.11 (port 8000)
- **Databases**: Neon Serverless Postgres + Qdrant Cloud (remote)

**Prerequisites**:
- Node.js 18+ and npm
- Python 3.11+
- Git
- Text editor (VS Code recommended)

---

## 1. Clone Repository & Install Dependencies

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Install Docusaurus plugins
npm install --save @docusaurus/theme-mermaid remark-math rehype-katex

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer docusaurus-plugin-tailwindcss

# Create Tailwind config
npx tailwindcss init
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Alembic for database migrations
pip install alembic asyncpg
```

---

## 2. Environment Variables

### Frontend `.env` (create in `frontend/` directory)

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Better-Auth config
VITE_BETTER_AUTH_URL=http://localhost:8000/api/auth

# PostHog analytics
VITE_POSTHOG_KEY=your_posthog_project_key
VITE_POSTHOG_HOST=https://app.posthog.com
```

### Backend `.env` (create in `backend/` directory)

```env
# Database
DATABASE_URL=postgresql://user:password@your-neon-db.com/dbname

# Qdrant
QDRANT_URL=https://your-qdrant-cluster.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# Better-Auth
BETTER_AUTH_SECRET=your_random_secret_key_here
BETTER_AUTH_TRUST_HOST=true

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret

# PostHog
POSTHOG_API_KEY=your_posthog_project_key
```

**How to get API keys**:
1. **Neon Postgres**: Sign up at [neon.tech](https://neon.tech), create project, copy connection string
2. **Qdrant**: Sign up at [cloud.qdrant.io](https://cloud.qdrant.io), create cluster, get API key
3. **OpenAI**: Sign up at [platform.openai.com](https://platform.openai.com), generate API key
4. **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
5. **GitHub OAuth**: [GitHub Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App
6. **PostHog**: Sign up at [posthog.com](https://posthog.com), create project, copy API key

---

## 3. Database Setup

### Run Alembic Migrations

```bash
cd backend

# Initialize Alembic (one-time setup)
alembic init alembic

# Create initial migration
alembic revision -m "initial schema" --autogenerate

# Apply migrations to Neon database
alembic upgrade head
```

### Verify Tables Created

```bash
# Connect to Neon using psql (optional)
psql $DATABASE_URL

# List tables
\dt

# Should see: users, user_progress, chat_messages, sessions
```

---

## 4. Seed Qdrant with Textbook Embeddings

```bash
cd backend

# Run embedding script (this may take 5-10 minutes for 13 weeks)
python scripts/embed_content.py

# Expected output:
# Processing Week 1... 15 chunks created
# Processing Week 2... 18 chunks created
# ...
# Total vectors uploaded to Qdrant: 234
```

**How it works**:
- Scans `frontend/docs/week-*/` directories
- Chunks each MDX file into 500-token segments
- Generates embeddings via OpenAI `text-embedding-3-small`
- Uploads vectors + metadata to Qdrant collection

---

## 5. Run Development Servers

### Start Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run with hot reload
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Output:
# INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
# INFO:     Started reloader process [12345]
```

### Start Frontend (Terminal 2)

```bash
cd frontend

# Run Docusaurus dev server
npm start

# Output:
# [INFO] Starting the development server...
# [SUCCESS] Docusaurus website is running at http://localhost:3000/
```

---

## 6. Verify Setup

### Test Frontend

1. Open browser to [http://localhost:3000](http://localhost:3000)
2. Navigate to "Week 1" from sidebar
3. Verify:
   - LaTeX equations render correctly (e.g., $\theta = \frac{\pi}{2}$)
   - Mermaid diagrams display (ROS 2 node graph)
   - "Personalize" button appears
   - "Translate to Urdu" toggle appears

### Test Backend API

```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status": "ok"}

# Test signup (create test user)
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "learning_path": "beginner"
  }'

# Expected response:
# {"id": "uuid-here", "email": "test@example.com", "learning_path": "beginner", ...}
```

### Test RAG Chatbot

1. Sign up/login on frontend
2. Navigate to any week's content
3. Highlight text (e.g., "Denavit-Hartenberg parameters")
4. Click "Ask AI about this"
5. Type question: "Explain this concept"
6. Verify:
   - Chatbot responds within 3 seconds
   - Response references selected text
   - Source citations include week/section

---

## 7. Common Issues & Troubleshooting

### Issue: "Module not found: remark-math"

**Solution**:
```bash
cd frontend
npm install remark-math rehype-katex
```

### Issue: LaTeX equations not rendering

**Solution**: Add KaTeX stylesheet to `docusaurus.config.ts`:
```ts
stylesheets: [
  'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css',
],
```

### Issue: Chatbot returns "Qdrant connection failed"

**Solution**:
1. Verify `QDRANT_URL` and `QDRANT_API_KEY` in backend `.env`
2. Run `python scripts/embed_content.py` to ensure vectors exist
3. Check Qdrant dashboard for collection `robotics_textbook_embeddings`

### Issue: OAuth login redirects fail

**Solution**:
1. Ensure OAuth redirect URIs match:
   - Google: `http://localhost:8000/api/auth/oauth/google/callback`
   - GitHub: `http://localhost:8000/api/auth/oauth/github/callback`
2. Restart backend after updating `.env` with OAuth credentials

### Issue: "Database connection refused"

**Solution**:
1. Verify `DATABASE_URL` in backend `.env`
2. Check Neon dashboard - database must be in "Active" state (not paused)
3. Test connection: `psql $DATABASE_URL`

---

## 8. Development Workflow

### Making Changes to Frontend

1. Edit MDX files in `frontend/docs/week-*/`
2. Docusaurus auto-reloads (hot module replacement)
3. No build step needed for local dev

### Making Changes to Backend

1. Edit Python files in `backend/src/`
2. Uvicorn auto-reloads (via `--reload` flag)
3. Re-run `embed_content.py` if MDX content structure changes

### Adding New API Endpoints

1. Create router in `backend/src/api/` (e.g., `certificates.py`)
2. Define Pydantic models in `backend/src/models/`
3. Update `backend/src/main.py` to include router:
   ```python
   from src.api import certificates
   app.include_router(certificates.router, prefix="/api", tags=["certificates"])
   ```
4. Regenerate OpenAPI spec: visit [http://localhost:8000/docs](http://localhost:8000/docs)

### Database Schema Changes

1. Edit SQLAlchemy models in `backend/src/models/`
2. Create migration:
   ```bash
   alembic revision -m "add certificates table" --autogenerate
   ```
3. Review migration file in `backend/alembic/versions/`
4. Apply migration:
   ```bash
   alembic upgrade head
   ```

---

## 9. Testing

### Run Frontend Tests

```bash
cd frontend
npm test
```

### Run Backend Tests

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

### Run E2E Tests (Playwright)

```bash
cd frontend
npx playwright test
```

---

## 10. Deployment Checklist

Before deploying to production:

- [ ] Update `.env` files with production URLs
- [ ] Run Alembic migrations on production database
- [ ] Seed Qdrant with all 13 weeks of embeddings
- [ ] Configure OAuth redirect URIs for production domain
- [ ] Enable PostHog analytics in production
- [ ] Set up HTTPS certificates (Vercel/Railway handle this automatically)
- [ ] Test chatbot with production OpenAI API key (check quota)
- [ ] Verify Urdu translations load correctly

---

## 11. Next Steps

After completing this quickstart:

1. Read `/specs/001-robotics-portal/spec.md` for feature requirements
2. Review `/specs/001-robotics-portal/data-model.md` for database schemas
3. Check `/specs/001-robotics-portal/contracts/api.openapi.yaml` for API documentation
4. Run `/sp.tasks` to generate implementation task list
5. Start implementing user stories in priority order (P1 → P2 → P3)

---

## Support

For questions or issues:
- Check `/specs/001-robotics-portal/plan.md` for architecture decisions
- Review Docusaurus documentation: [https://docusaurus.io/docs](https://docusaurus.io/docs)
- Review FastAPI documentation: [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- Contact Panaversity dev team: support@panaversity.pk
