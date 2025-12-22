# ⚡ Quick Deploy Commands

Copy-paste these commands for rapid deployment.

---

## 🎯 GitHub Push (First Time)

```bash
cd D:/Q-4-01

# Initialize and commit
git init
git add .
git commit -m "🎨 Add beautiful authentication UI with RAG chatbot"

# Create GitHub repo and push
gh repo create physical-ai-portal --private --source=. --remote=origin --push

# Or manually:
git remote add origin https://github.com/YOUR_USERNAME/physical-ai-portal.git
git branch -M main
git push -u origin main
```

---

## 🚀 Vercel Deploy

### Backend

```bash
cd backend
vercel --prod

# Set environment variables
vercel env add DATABASE_URL production
# postgresql://neondb_owner:PASSWORD@ep-patient-wave-ahpat21m.us-east-1.aws.neon.tech/neondb

vercel env add QDRANT_URL production
# https://d9591c7e-519d-4674-b8ed-d57bf9fdd2d1.europe-west3-0.gcp.cloud.qdrant.io

vercel env add QDRANT_API_KEY production
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.va4QEe4M-ypgWcLQlD0IhNEyV4LOFqzpDin1JcQBtdE

vercel env add COHERE_API_KEY production
# Cy1EaVXLQepJBtkpPmFOalYMNCoL63RmiPYhlwhB

vercel env add JWT_SECRET production
# Generate with: openssl rand -hex 32

# Redeploy with env vars
vercel --prod

# Copy the production URL
```

### Frontend

```bash
cd ../frontend

# Update .env with backend URL
echo "VITE_API_URL=https://physical-ai-backend-xxx.vercel.app" > .env

# Deploy
vercel --prod

# Set environment variable
vercel env add VITE_API_URL production
# https://physical-ai-backend-xxx.vercel.app

# Redeploy
vercel --prod
```

---

## 💾 Database Setup (One-Time)

```bash
# Initialize schema
psql "postgresql://neondb_owner:PASSWORD@ep-patient-wave-ahpat21m.us-east-1.aws.neon.tech/neondb" -f backend/scripts/init_db.sql

# Ingest chapter data
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python scripts/ingest_chapters.py
```

---

## 🔄 Future Updates

```bash
# Make changes...
git add .
git commit -m "feat: your changes"
git push

# Vercel auto-deploys if connected to GitHub
# Or manually:
cd backend && vercel --prod
cd ../frontend && vercel --prod
```

---

## ✅ Verify Deployment

```bash
# Backend health check
curl https://your-backend.vercel.app/

# Check API docs
open https://your-backend.vercel.app/docs

# Test frontend
open https://your-frontend.vercel.app/
```

---

## 🐛 Quick Fixes

### Clear frontend cache
```bash
cd frontend
npm run clear
rm -rf .docusaurus node_modules/.cache
npm install
npm start -- --port 3001
```

### View Vercel logs
```bash
vercel logs https://your-project.vercel.app
```

### Check environment variables
```bash
vercel env ls
```

---

**Done! 🎉**

Your app is live at:
- Frontend: https://your-frontend.vercel.app
- Backend: https://your-backend.vercel.app

See [GITHUB_DEPLOY_GUIDE.md](./GITHUB_DEPLOY_GUIDE.md) for detailed instructions.
