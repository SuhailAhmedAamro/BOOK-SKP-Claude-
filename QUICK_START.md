# 🚀 Quick Start Guide

## ✅ Integration Complete!

All 3 final steps are done. Your app is ready to test and deploy!

---

## 🧪 Local Testing (5 minutes)

### Step 1: Initialize Database

```bash
# Copy your Neon database URL from backend/.env
# Then run:
psql "YOUR_NEON_DATABASE_URL" < backend/scripts/init_db.sql
```

**Expected output:** Tables created successfully

### Step 2: Ingest Book Chapters

```bash
cd backend
python scripts/ingest_chapters.py
```

**Expected output:**
```
Starting chapter ingestion...
✓ Created Qdrant collection: robotics_textbook
Found 13 chapter files
Processing: Chapter 1 Foundation.md
...
✅ Ingestion complete! Total chunks: 127
```

**⏱ Takes ~5 minutes**

### Step 3: Start Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
✓ Database connection pool created
✓ Qdrant collection verified
```

### Step 4: Start Frontend

**New terminal:**
```bash
cd frontend
npm start
```

**Expected output:**
```
[SUCCESS] Docusaurus website is running at: http://localhost:3000/
```

---

## ✅ Testing Checklist

### 1. Test Authentication Flow

1. Visit http://localhost:3000
2. Click **"Explore The BOOK 📖"**
3. Should redirect to http://localhost:3000/auth/signin
4. Click **"Sign Up"**
5. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
6. Click **"Sign Up"**
7. **Modal should appear:** "Welcome! Tell us about your background"
8. Select **"Software"** or **"Hardware"**
9. Click **"Continue"**
10. Should redirect to http://localhost:3000/docs/BOOK/intro

✅ **Success:** You're now authenticated and viewing the book!

### 2. Test Chatbot

1. Look for **floating blue button** at bottom-right (💬 icon)
2. Click it
3. Chat window opens (400px × 600px)
4. Type: **"What is Physical AI?"**
5. Press Enter or click send
6. **Expected response:**
   - Personalized answer (Software or Hardware focus)
   - Source citations at bottom (Chapter numbers)
   - Response within 5 seconds

✅ **Success:** Chatbot is working!

### 3. Test Text Selection Feature

1. On any chapter page, **highlight 2-3 sentences** with your mouse
2. Release mouse button
3. **Blue "Ask about this" button should appear** near your selection
4. Click the button
5. Chatbot should:
   - Open automatically
   - Show "Selected: [your text]" at top
6. Type: **"Explain this"**
7. Response should be specific to your selected text

✅ **Success:** Selection feature working!

### 4. Test Personalization

**If you selected "Software":**
- Responses should mention ROS 2, Python, C++, simulation
- Less focus on hardware kits

**If you selected "Hardware":**
- Responses should mention Jetson Orin, RealSense, physical robots
- Practical deployment tips

**Test question:** "How do I get started with robotics?"

✅ **Success:** Response is tailored to your background!

---

## 🚨 Common Issues & Fixes

### Issue: "Failed to fetch" error in chat

**Fix:**
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Should return:
# {"status":"healthy","database":"connected","version":"1.0.0"}
```

### Issue: Chatbot button not appearing

**Fix:** Make sure you're logged in. Click "Explore The BOOK" and sign in.

### Issue: "Collection not found" in backend

**Fix:**
```bash
cd backend
python scripts/ingest_chapters.py
```

### Issue: Database connection error

**Fix:** Check `backend/.env` has correct `DATABASE_URL`

---

## 🚀 Deploy to Production

Once local testing passes, deploy:

### Backend

```bash
cd backend
vercel --prod
```

**Configure in Vercel dashboard:**
- DATABASE_URL
- QDRANT_URL
- QDRANT_API_KEY
- COHERE_API_KEY
- SECRET_KEY (generate: `openssl rand -hex 32`)
- FRONTEND_URL (your Vercel frontend URL)

**Save backend URL** (e.g., https://your-api.vercel.app)

### Frontend

1. Update `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-api.vercel.app
   ```

2. Deploy:
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

---

## 📊 Verify Production

1. Visit your frontend URL
2. Sign up with real email
3. Test chat functionality
4. Check backend health: `https://your-api.vercel.app/api/health`

---

## 🎉 You're Live!

Your RAG chatbot is now deployed with:
- ✅ Authentication & gatekeeping
- ✅ Personalized AI tutor
- ✅ Text selection feature
- ✅ Urdu translation ready
- ✅ Chapter progress tracking

---

## 📚 Next Steps

1. **Invite users** to test
2. **Monitor** Vercel logs for errors
3. **Check Cohere usage** (API costs)
4. **Backup** Neon database
5. **Add analytics** (PostHog already configured in .env.example)

---

## 🆘 Need Help?

- Check `DEPLOYMENT_GUIDE.md` for detailed troubleshooting
- Review `IMPLEMENTATION_COMPLETE.md` for architecture details
- Check Vercel logs for deployment errors

---

**Built with:** FastAPI • Neon Postgres • Qdrant • Cohere • Docusaurus • React • Tailwind CSS

**Time to deploy:** 30 minutes
**Time to test locally:** 5 minutes

🚀 **Happy deploying!**
