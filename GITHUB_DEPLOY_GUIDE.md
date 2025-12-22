# 🚀 GitHub & Vercel Deployment Guide

Complete guide to push your code to GitHub and deploy to Vercel.

---

## 📋 Pre-Deployment Checklist

### ✅ Step 1: Verify Everything Works Locally

```bash
# Test frontend
cd frontend
npm start -- --port 3001

# Test backend (in new terminal)
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

**Visit**: http://localhost:3001 and test:
- [ ] Homepage loads
- [ ] Sign up flow works
- [ ] Profile selection modal works
- [ ] Sign in works
- [ ] Chat widget appears (even if backend not connected)

---

## 🔐 Step 2: Secure Your Credentials

### Update .gitignore

Your `.gitignore` file already includes:
```
.env
.env.local
.env.production
.env.*.local
*.env
```

### Verify Sensitive Files Are Ignored

```bash
# Check what will be committed
git status

# Make sure these are NOT listed:
# ❌ frontend/.env
# ❌ backend/.env
# ❌ Any files with API keys
```

---

## 🌿 Step 3: Initialize Git Repository

```bash
# If not already initialized
cd D:/Q-4-01
git init

# Set your identity
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

## 📦 Step 4: Add Files to Git

```bash
# Add all files
git add .

# Check what's staged
git status

# Create first commit
git commit -m "🎨 Add beautiful authentication UI with RAG chatbot

Features:
- Glassmorphism auth UI (SignIn, SignUp, Profile Selection)
- Password strength indicator
- Floating chat widget with text selection
- RAG-powered AI chatbot with Cohere + Qdrant
- JWT authentication with Neon Postgres
- Personalized learning paths (Software/Hardware)
- Urdu translation support
- Mobile responsive design
- Dark mode optimized

Tech Stack:
- Frontend: Docusaurus 3.9.2 + React 19 + Tailwind CSS
- Backend: FastAPI + Python 3.11
- Database: Neon Postgres + Qdrant Cloud
- AI: Cohere (embeddings + generation)"
```

---

## 🌐 Step 5: Create GitHub Repository

### Option A: Via GitHub Website

1. Go to https://github.com/new
2. Repository name: `physical-ai-portal` (or your choice)
3. Description: "Interactive educational platform for Physical AI & Robotics"
4. Visibility: Private or Public
5. **DO NOT** initialize with README (you already have one)
6. Click "Create repository"

### Option B: Via GitHub CLI

```bash
# Install GitHub CLI: https://cli.github.com/
gh auth login
gh repo create physical-ai-portal --private --source=. --remote=origin
```

---

## ⬆️ Step 6: Push to GitHub

```bash
# Add remote (if not done via gh CLI)
git remote add origin https://github.com/YOUR_USERNAME/physical-ai-portal.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main

# If you get "main vs master" error:
git branch -M main
git push -u origin main
```

---

## 🚀 Step 7: Deploy to Vercel

### A. Install Vercel CLI

```bash
npm install -g vercel
```

### B. Login to Vercel

```bash
vercel login
```

### C. Deploy Backend

```bash
cd backend
vercel --prod
```

**During deployment, answer:**
- Set up and deploy? **Y**
- Which scope? **(Select your team/account)**
- Link to existing project? **N**
- Project name? `physical-ai-backend`
- Directory? `./` (press Enter)
- Override settings? **N**

**After deployment:**
- Copy the production URL: `https://physical-ai-backend-xxx.vercel.app`

### D. Set Backend Environment Variables

```bash
# Still in backend directory
vercel env add DATABASE_URL production
# Paste: postgresql://neondb_owner:...@ep-patient-wave-ahpat21m.us-east-1.aws.neon.tech/neondb

vercel env add QDRANT_URL production
# Paste: https://d9591c7e-519d-4674-b8ed-d57bf9fdd2d1.europe-west3-0.gcp.cloud.qdrant.io

vercel env add QDRANT_API_KEY production
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.va4QEe4M-ypgWcLQlD0IhNEyV4LOFqzpDin1JcQBtdE

vercel env add COHERE_API_KEY production
# Paste: Cy1EaVXLQepJBtkpPmFOalYMNCoL63RmiPYhlwhB

vercel env add JWT_SECRET production
# Paste a strong random string: openssl rand -hex 32
```

**Redeploy backend with env vars:**
```bash
vercel --prod
```

### E. Deploy Frontend

```bash
cd ../frontend
```

**Update `.env`** with production backend URL:
```env
VITE_API_URL=https://physical-ai-backend-xxx.vercel.app
```

```bash
# Deploy to Vercel
vercel --prod
```

**During deployment:**
- Project name? `physical-ai-frontend`
- Directory? `./` (press Enter)
- Override settings? **Y**
  - Build Command: `npm run build`
  - Output Directory: `build`
  - Install Command: `npm install`

**After deployment:**
- Copy the frontend URL: `https://physical-ai-frontend-xxx.vercel.app`

### F. Set Frontend Environment Variable

```bash
vercel env add VITE_API_URL production
# Paste: https://physical-ai-backend-xxx.vercel.app

# Redeploy
vercel --prod
```

---

## ✅ Step 8: Verify Deployment

### Test Backend

```bash
curl https://physical-ai-backend-xxx.vercel.app/
# Should return: {"message":"Physical AI RAG Chatbot API","status":"running"}

curl https://physical-ai-backend-xxx.vercel.app/docs
# Should show FastAPI docs
```

### Test Frontend

1. Visit: https://physical-ai-frontend-xxx.vercel.app
2. Click "Explore The BOOK 📖"
3. Try signing up
4. Select Software or Hardware
5. Test chat widget

---

## 🎯 Step 9: Initialize Database (One-Time)

```bash
# Connect to Neon Postgres
psql "postgresql://neondb_owner:PASSWORD@ep-patient-wave-ahpat21m.us-east-1.aws.neon.tech/neondb"

# Run schema
\i backend/scripts/init_db.sql

# Exit
\q
```

---

## 📊 Step 10: Ingest Chapter Data (One-Time)

```bash
cd backend
source venv/bin/activate
python scripts/ingest_chapters.py
```

---

## 🔄 Future Updates

### To update code:

```bash
# Make changes...
git add .
git commit -m "feat: add new feature"
git push

# Vercel auto-deploys on push if connected to GitHub
# Or manually:
cd backend && vercel --prod
cd frontend && vercel --prod
```

### To connect Vercel to GitHub (auto-deploy):

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Git → Connect Git Repository
4. Select your GitHub repo
5. Now every push to `main` auto-deploys!

---

## 🐛 Troubleshooting

### Issue: "Port 3000 already in use"

```bash
# Use different port
npm start -- --port 3001
```

### Issue: "Module not found" errors

```bash
cd frontend
npm run clear
rm -rf .docusaurus node_modules/.cache
npm install
npm start
```

### Issue: Backend not connecting

```bash
# Check backend logs
vercel logs https://physical-ai-backend-xxx.vercel.app

# Verify environment variables
vercel env ls
```

### Issue: "process is not defined"

Already fixed! We use `import.meta.env` instead of `process.env`.

### Issue: Database connection fails

```bash
# Test connection
psql "$DATABASE_URL"

# Check if tables exist
\dt
```

---

## 📝 Domain Setup (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel Dashboard → Your Project
2. Settings → Domains
3. Add domain: `yourdomain.com`
4. Update DNS records as instructed by Vercel

---

## 🎉 You're Live!

Your application is now deployed and accessible worldwide!

**Frontend**: https://physical-ai-frontend-xxx.vercel.app
**Backend**: https://physical-ai-backend-xxx.vercel.app

### Next Steps:

- [ ] Share the link with users
- [ ] Monitor analytics
- [ ] Collect feedback
- [ ] Iterate and improve

---

## 📞 Support

If you encounter issues:

1. Check Vercel logs: `vercel logs`
2. Check GitHub Actions (if setup)
3. Review error messages in browser console
4. Contact support@panaversity.pk

---

**Congratulations! Your Physical AI Portal is live! 🎊**
