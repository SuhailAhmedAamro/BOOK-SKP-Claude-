# 🚀 Deployment Ready - Physical AI & Humanoid Robotics Portal

This project is now configured and ready for deployment with:
- **Backend**: Railway (Docker/Dockerfile)
- **Frontend**: Vercel (Docusaurus/React)

---

## 📋 Pre-Deployment Checklist

### ✅ Completed Security Fixes
- [x] Backend `.gitignore` updated to exclude `.env` files
- [x] Frontend `.gitignore` updated to exclude `.env` files
- [x] Created `.env.example` files for both backend and frontend
- [x] CORS configuration updated to use environment variables
- [x] Removed backend `vercel.json` (backed up as `vercel.json.backup`)

### ⚠️ Required Actions Before Deployment

1. **Generate Production Secret Key** (CRITICAL)
   ```bash
   openssl rand -hex 32
   ```
   Use this value for `SECRET_KEY` in Railway environment variables

2. **Verify API Keys**
   - Ensure you have valid Google Gemini API key
   - Ensure Neon Postgres and Qdrant credentials are active

3. **Update Production URLs** (after deployment)
   - Note your Railway backend URL
   - Note your Vercel frontend URL
   - Update environment variables accordingly

---

## 🚂 Part 1: Deploy Backend to Railway

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select this repository
4. Railway will auto-detect the `Dockerfile` in root

### Step 2: Configure Environment Variables

In Railway dashboard, add these environment variables:

```env
# Google Gemini API
GEMINI_API_KEY=AIzaSyBUnhJlJ4rCbfJ61Xw7DIDSnpUMXIwCWtk

# Neon Postgres Database
DATABASE_URL=postgresql://neondb_owner:npg_H6o5LOFBYzSf@ep-purple-recipe-a8de5pnj-pooler.eastus2.azure.neon.tech/neondb?sslmode=require

# Qdrant Cloud Vector Database
QDRANT_URL=https://d9591c7e-519d-4674-b8ed-d57bf9fdd2d1.europe-west3-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.va4QEe4M-ypgWcLQlD0IhNEyV4LOFqzpDin1JcQBtdE

# Auth Settings (IMPORTANT: Generate new SECRET_KEY!)
SECRET_KEY=[PASTE-OUTPUT-FROM-openssl-rand-hex-32]
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS & Frontend URL (Update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app
```

### Step 3: Deploy

1. Railway will automatically build using `Dockerfile`
2. Railway provides `PORT` environment variable automatically
3. Wait for build to complete (~3-5 minutes)
4. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

### Step 4: Test Backend

Visit: `https://your-railway-url.up.railway.app/`

Expected response:
```json
{"status": "healthy", "version": "1.0.0"}
```

Test health check: `https://your-railway-url.up.railway.app/api/health`

---

## ▲ Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment Variables

Before deploying, you need to configure the frontend to use your Railway backend URL.

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to [vercel.com](https://vercel.com)
2. Import this repository
3. Set **Root Directory** to `frontend`
4. Add environment variable in Vercel dashboard:
   - `VITE_API_URL` = `https://your-railway-url.up.railway.app`

**Option B: Using Local .env.production (Alternative)**

1. Create `frontend/.env.production` (already gitignored):
   ```env
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
2. Commit and push (file is gitignored, safe to keep locally)

### Step 2: Deploy to Vercel

1. Click **"Import Project"** on Vercel
2. Select this repository
3. Configure:
   - **Framework Preset**: Docusaurus
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. Add Environment Variables (if not done in Step 1):
   ```
   VITE_API_URL = https://your-railway-url.up.railway.app
   ```

5. Click **"Deploy"**

### Step 3: Update Railway CORS Configuration

Once deployed, note your Vercel URL (e.g., `https://your-app.vercel.app`)

1. Go back to Railway dashboard
2. Update environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Railway will automatically redeploy

### Step 4: Test Full Application

1. Visit your Vercel URL
2. Try signing up/logging in
3. Test the chat widget (Ctrl/Cmd + K)
4. Verify API calls work in browser DevTools

---

## 🔧 Project Configuration Files

### Backend (Railway)

- **Dockerfile**: Root directory - Used by Railway for deployment
- **requirements.txt**: Python dependencies
- **app/**: FastAPI application code
- **.env**: Local development only (gitignored)
- **.env.example**: Template for environment variables

### Frontend (Vercel)

- **vercel.json**: Deployment configuration
  - Framework: Docusaurus
  - Build command: `npm run build`
  - Output: `build/`
- **package.json**: Node.js dependencies
- **.env**: Local development (gitignored)
- **.env.example**: Template for environment variables

---

## 🌍 Environment Variable Summary

### Backend Environment Variables (Railway)

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `DATABASE_URL` | Neon Postgres connection string | `postgresql://...` |
| `QDRANT_URL` | Qdrant Cloud cluster URL | `https://...qdrant.io` |
| `QDRANT_API_KEY` | Qdrant API key | `eyJh...` |
| `SECRET_KEY` | JWT secret (min 32 chars) | Generate with `openssl rand -hex 32` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | `10080` (1 week) |
| `FRONTEND_URL` | Vercel frontend URL | `https://your-app.vercel.app` |

### Frontend Environment Variables (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Railway backend URL | `https://your-app.up.railway.app` |

---

## 🔍 Verification Steps

### 1. Backend Health Check
```bash
curl https://your-railway-url.up.railway.app/api/health
```

Expected:
```json
{"status": "healthy", "database": "connected"}
```

### 2. Frontend Build Logs
Check Vercel deployment logs for:
- ✓ Dependencies installed
- ✓ Docusaurus build successful
- ✓ Static files generated in `build/`

### 3. CORS Check
Open browser DevTools → Network tab:
- API calls should have `Access-Control-Allow-Origin` header
- No CORS errors in console

### 4. Authentication Flow
1. Sign up with test email
2. Verify JWT token in browser localStorage
3. Test protected routes (profile, chat)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `DATABASE_URL` connection error

**Solution**:
- Verify Neon database is active
- Check connection string has `?sslmode=require`
- Test connection from Railway logs

**Problem**: CORS errors

**Solution**:
- Ensure `FRONTEND_URL` matches exact Vercel URL
- Check Railway logs for CORS origins list
- Redeploy after updating `FRONTEND_URL`

### Frontend Issues

**Problem**: API calls returning 404

**Solution**:
- Verify `VITE_API_URL` is set correctly
- Check Railway backend is deployed and healthy
- Inspect Network tab for actual URL being called

**Problem**: Build fails on Vercel

**Solution**:
- Check Node.js version (requires >=20.0)
- Verify `frontend/` is set as root directory
- Check build logs for missing dependencies

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────┐
│  User Browser                                │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│  Vercel Edge Network (Frontend)              │
│  - Docusaurus Static Site                   │
│  - React 19 Components                       │
│  - Tailwind CSS                              │
│  URL: https://your-app.vercel.app            │
└────────────┬────────────────────────────────┘
             │ HTTPS/REST API
             │ (CORS-enabled)
             ▼
┌─────────────────────────────────────────────┐
│  Railway (Backend Docker Container)          │
│  - FastAPI + Uvicorn                         │
│  - Python 3.11                               │
│  - JWT Authentication                        │
│  URL: https://your-app.up.railway.app        │
└────────────┬────────────────────────────────┘
             │
      ┌──────┴───────┐
      ▼              ▼
┌────────────┐  ┌──────────────┐
│  Neon      │  │  Qdrant      │
│  Postgres  │  │  Cloud       │
│  (Users)   │  │  (Vectors)   │
└────────────┘  └──────────────┘
```

---

## 🔒 Security Checklist

- [x] `.env` files in `.gitignore`
- [x] `.env.example` files provided (no secrets)
- [x] Production `SECRET_KEY` must be generated (not using default)
- [x] CORS origins restricted to specific domains
- [x] HTTPS enforced (Railway + Vercel auto-provide)
- [x] Rate limiting enabled (10 req/60 sec)
- [x] JWT tokens with expiry
- [x] Password hashing with bcrypt
- [x] SQL injection protection (parameterized queries)
- [x] Security headers in Vercel config

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Docusaurus Deployment](https://docusaurus.io/docs/deployment)

---

## 🎯 Next Steps After Deployment

1. **Database Initialization**
   ```bash
   # Run from Railway console or locally with production DATABASE_URL
   psql $DATABASE_URL < backend/scripts/init_db.sql
   ```

2. **Ingest Chapter Data to Qdrant**
   ```bash
   # Run from Railway console
   cd /app && python scripts/ingest_chapters.py
   ```

3. **Monitor Logs**
   - Railway: Check application logs for errors
   - Vercel: Monitor build and function logs

4. **Set Up Custom Domain** (Optional)
   - Railway: Add custom domain in settings
   - Vercel: Add custom domain in project settings

5. **Enable Analytics** (Optional)
   - Add PostHog key to frontend environment variables
   - Monitor user engagement and errors

---

## ✅ Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend (Railway) | ⏳ Ready to Deploy | `https://your-app.up.railway.app` |
| Frontend (Vercel) | ⏳ Ready to Deploy | `https://your-app.vercel.app` |
| Database (Neon) | ✅ Connected | - |
| Vector DB (Qdrant) | ✅ Connected | - |

---

**Last Updated**: 2025-12-22
**Project**: Physical AI & Humanoid Robotics Portal
**Stack**: FastAPI + React + Docusaurus + Railway + Vercel
