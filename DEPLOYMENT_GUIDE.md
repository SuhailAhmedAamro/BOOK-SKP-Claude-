# 🚀 Deployment Guide: Physical AI RAG Chatbot

Complete guide to deploy your RAG chatbot system with authentication, personalization, and Urdu translation.

## 📋 Prerequisites

- Node.js 20+ (for frontend)
- Python 3.11+ (for backend)
- Neon Postgres account
- Qdrant Cloud account
- Cohere API key
- Vercel account

## 🔧 Backend Setup & Deployment

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Initialize Database

Run the SQL script on your Neon Postgres database:

```bash
# Using psql
psql "postgresql://neondb_owner@ep-patient-wave-ahpat21m.us-east-1.aws.neon.tech/neondb?sslmode=require" < scripts/init_db.sql
```

Or copy the contents of `backend/scripts/init_db.sql` and execute in the Neon Console SQL Editor.

### 3. Ingest Book Chapters

Generate embeddings and upload to Qdrant:

```bash
cd backend
python scripts/ingest_chapters.py
```

Expected output:
```
Starting chapter ingestion...
✓ Created Qdrant collection: robotics_textbook
Found 13 chapter files

Processing: Chapter 1 Foundation.md
  Title: Chapter 1: Introduction to Physical AI
  Sections: 8
  ✓ Uploaded 8 sections

...

✅ Ingestion complete! Total chunks: 127
Collection points count: 127
```

### 4. Test Backend Locally

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Visit http://localhost:8000 - you should see:
```json
{
  "status": "healthy",
  "service": "Physical AI RAG Chatbot API",
  "version": "1.0.0"
}
```

Test health check: http://localhost:8000/api/health

### 5. Deploy Backend to Vercel

```bash
cd backend
npm i -g vercel  # if not installed
vercel login
vercel --prod
```

Configure environment variables in Vercel dashboard:
- `DATABASE_URL` - Your Neon Postgres connection string
- `QDRANT_URL` - https://d9591c7e-519d-4674-b8ed-d57bf9fdd2d1.europe-west3-0.gcp.cloud.qdrant.io
- `QDRANT_API_KEY` - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.va4QEe4M-ypgWcLQlD0IhNEyV4LOFqzpDin1JcQBtdE
- `COHERE_API_KEY` - Cy1EaVXLQepJBtkpPmFOalYMNCoL63RmiPYhlwhB
- `SECRET_KEY` - Generate with: `openssl rand -hex 32`
- `FRONTEND_URL` - https://book-skp-claude.vercel.app

**Save your backend URL** (e.g., https://your-backend.vercel.app)

---

## 🎨 Frontend Setup & Deployment

### 1. Install Dependencies

```bash
cd frontend
npm install
npm install uuid  # Required for chat session IDs
```

### 2. Update Environment Variables

Edit `frontend/.env`:
```env
VITE_API_URL=https://your-backend.vercel.app
```

Replace `your-backend.vercel.app` with your actual backend URL from step 5 above.

### 3. Wrap App with AuthProvider

Create `frontend/src/theme/Root.tsx`:

```tsx
import React from 'react';
import { AuthProvider } from '../hooks/useAuth';
import ChatWidget from '../components/chat/ChatWidget';
import SelectionHandler from '../components/chat/SelectionHandler';

export default function Root({ children }) {
  return (
    <AuthProvider>
      {children}
      <ChatWidget />
      <SelectionHandler />
    </AuthProvider>
  );
}
```

### 4. Create Selection Handler

Create `frontend/src/components/chat/SelectionHandler.tsx`:

```tsx
import React, { useState } from 'react';
import { useSelection } from '../../hooks/useSelection';
import { useAuth } from '../../hooks/useAuth';
import SelectionButton from './SelectionButton';

export default function SelectionHandler() {
  const { selectedText, selectionPosition, clearSelection } = useSelection();
  const { isAuthenticated } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  if (!isAuthenticated || !selectedText || !selectionPosition) {
    return null;
  }

  const handleClick = () => {
    // Store selected text in sessionStorage for ChatWidget to pick up
    sessionStorage.setItem('selectedTextForChat', selectedText);
    clearSelection();

    // Trigger chat widget to open
    const event = new CustomEvent('openChatWithSelection', {
      detail: { selectedText }
    });
    window.dispatchEvent(event);
  };

  return <SelectionButton position={selectionPosition} onClick={handleClick} />;
}
```

### 5. Update Homepage Auth Check

Edit `frontend/src/pages/index.tsx` - find the "Explore The BOOK" button and update:

```tsx
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from '@docusaurus/router';

// Inside component:
const { isAuthenticated } = useAuth();
const navigate = useNavigate();

const handleExploreClick = () => {
  if (!isAuthenticated) {
    navigate('/auth/signin?redirect=/docs/BOOK/intro');
  } else {
    navigate('/docs/BOOK/intro');
  }
};

// Update button:
<button onClick={handleExploreClick} className="button button--primary button--lg">
  Explore The BOOK 📖
</button>
```

### 6. Test Frontend Locally

```bash
cd frontend
npm start
```

Visit http://localhost:3000

**Test Flow:**
1. Click "Explore The BOOK" → Should redirect to signup
2. Sign up with email/password → Select Software or Hardware
3. Should redirect to /docs/BOOK/intro
4. See floating chat button at bottom-right
5. Select text → "Ask about this" button appears
6. Ask questions in chat → Get personalized responses

### 7. Deploy Frontend to Vercel

```bash
cd frontend
vercel --prod
```

---

## ✅ Post-Deployment Verification

### Test Authentication
1. Visit your frontend URL
2. Click "Explore The BOOK"
3. Sign up with test credentials
4. Select background (Software/Hardware)
5. Verify redirect to chapters

### Test RAG Chatbot
1. Open a chapter (e.g., Chapter 1)
2. Click floating chat button
3. Ask: "What is Physical AI?"
4. Verify personalized response with sources

### Test Selection Feature
1. Highlight text in a chapter (>10 characters)
2. Click "Ask about this" button
3. Ask question about selected text
4. Verify response focuses on selection

### Test Translation
1. Open chatbot
2. Ask for translation: "Translate this chapter to Urdu"
3. Verify Urdu response with preserved technical terms

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "Collection not found"**
```bash
cd backend
python scripts/ingest_chapters.py
```

**Error: "Database connection failed"**
- Verify DATABASE_URL in Vercel environment variables
- Check Neon Postgres is active (not paused)

**Error: "Cohere API key invalid"**
- Verify COHERE_API_KEY in Vercel settings
- Check API key hasn't expired

### Frontend Issues

**Error: "Failed to fetch"**
- Check VITE_API_URL in .env points to backend URL
- Verify backend is deployed and healthy
- Check CORS settings in backend allow your frontend URL

**Chatbot not appearing**
- Ensure you're logged in
- Check browser console for errors
- Verify AuthProvider wraps the app in Root.tsx

**"Ask about this" button not showing**
- Select more than 10 characters
- Check SelectionHandler is rendered in Root.tsx

---

## 📊 Monitoring

### Backend Health
```bash
curl https://your-backend.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0"
}
```

### Check Qdrant Collection
```bash
# In backend directory
python -c "from app.db.qdrant import get_qdrant_client; client = get_qdrant_client(); print(client.get_collection('robotics_textbook'))"
```

---

## 🎯 Next Steps

1. **Customize Personalization:** Edit `backend/app/chat/rag_service.py` → `get_personalization_context()`
2. **Add More Features:** Chapter progress visualization, learning analytics
3. **Improve Translation:** Add more technical terms to preserve
4. **Scale:** Configure auto-scaling in Vercel for high traffic

---

## 📝 Environment Variables Checklist

### Backend (Vercel)
- [ ] DATABASE_URL
- [ ] QDRANT_URL
- [ ] QDRANT_API_KEY
- [ ] COHERE_API_KEY
- [ ] SECRET_KEY
- [ ] FRONTEND_URL

### Frontend (Vercel)
- [ ] VITE_API_URL

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Backend health check returns "healthy"
- ✅ Qdrant collection has 100+ points
- ✅ Users can signup/signin
- ✅ Profile selection (Software/Hardware) works
- ✅ Chatbot appears after login
- ✅ Chat responses are personalized
- ✅ Text selection feature works
- ✅ Urdu translation works

---

## 🔗 Useful Links

- **Frontend:** https://book-skp-claude.vercel.app
- **Backend API:** https://your-backend.vercel.app
- **Neon Console:** https://console.neon.tech
- **Qdrant Dashboard:** https://cloud.qdrant.io
- **Cohere Dashboard:** https://dashboard.cohere.com

---

**Need help?** Check the logs in Vercel dashboard or open an issue in the GitHub repo.
