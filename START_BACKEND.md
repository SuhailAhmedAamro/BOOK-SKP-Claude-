# Backend Server Ko Kaise Chalaye? 🚀

## Quick Start (Urdu/English)

### Step 1: Python Install Karo (Agar nahi hai)
Python 3.11+ chahiye hoga. Check karo:
```bash
python --version
```

### Step 2: Backend Folder Mein Jao
```bash
cd backend
```

### Step 3: Virtual Environment Banao
```bash
# Windows
python -m venv .venv

# Linux/Mac
python3 -m venv .venv
```

### Step 4: Virtual Environment Activate Karo
```bash
# Windows (PowerShell)
.venv\Scripts\Activate.ps1

# Windows (CMD)
.venv\Scripts\activate.bat

# Linux/Mac
source .venv/bin/activate
```

### Step 5: Dependencies Install Karo

**IMPORTANT for Windows Users:** Agar psycopg2 error aayi toh pehle ye karo:
```bash
# Upgrade pip aur setuptools
python -m pip install --upgrade pip setuptools wheel

# Ab dependencies install karo
pip install -r requirements.txt
```

**Agar phir bhi error aaye** (pg_config not found):
```bash
# Alternative approach - install packages one by one
pip install fastapi uvicorn[standard] python-multipart pydantic pydantic-settings
pip install asyncpg  # Use asyncpg instead of psycopg2 for async operations
pip install cohere qdrant-client
pip install python-jose[cryptography] passlib[bcrypt] python-dotenv httpx

# Then manually install psycopg2 (optional if asyncpg works)
pip install psycopg2-binary --no-binary psycopg2-binary || pip install psycopg2-binary
```

### Step 6: Environment Variables Set Karo
Backend folder mein `.env` file already hai. Agar nahi hai toh:
```bash
cp .env.example .env
```

### Step 7: Server Start Karo! 🎉
```bash
# Development mode (with auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Simple command
python -m uvicorn app.main:app --reload
```

### Step 8: Check Karo Server Chal Raha Hai Ya Nahi
Browser mein kholo: http://localhost:8000/docs

Agar Swagger UI dikhe toh **SUCCESS!** ✅

---

## Frontend Ko Backend Se Connect Karo

Frontend already configured hai. Bas ye check karo ki `frontend/.env.production` mein:
```env
VITE_API_URL=http://localhost:8000
```

---

## Common Problems & Solutions 🔧

### Problem: "ModuleNotFoundError"
**Solution:** Virtual environment activate karo aur dependencies install karo:
```bash
.venv\Scripts\activate
pip install -r requirements.txt
```

### Problem: "Port 8000 already in use"
**Solution:** Dusra port use karo:
```bash
uvicorn app.main:app --reload --port 8001
```
Frontend mein `.env` update karo: `VITE_API_URL=http://localhost:8001`

### Problem: "Database connection error"
**Solution:** `.env` file mein DATABASE_URL check karo. Neon database credentials sahi hone chahiye.

---

## Quick Commands (Yaad Rakhne Ke Liye)

```bash
# Backend start karna
cd backend
.venv\Scripts\activate    # (Windows)
uvicorn app.main:app --reload

# Frontend start karna (dusre terminal mein)
cd frontend
npm start

# Dono ek saath chalane ke liye (root folder se)
npm run dev   # agar package.json mein script hai
```

---

## API Endpoints

Backend chalane ke baad ye endpoints available honge:

- **Auth:**
  - POST `/api/auth/signup` - Naya account banao
  - POST `/api/auth/signin` - Login karo
  - POST `/api/auth/signout` - Logout karo
  - GET `/api/auth/session` - Current user info

- **User:**
  - POST `/api/user/profile` - Profile set karo (Software/Hardware)
  - GET `/api/user/profile` - Profile dekho
  - POST `/api/user/progress` - Progress update karo

- **Chat:**
  - POST `/api/chat/message` - AI se baat karo
  - GET `/api/chat/history` - Chat history dekho

---

## API Documentation

Server start karne ke baad automatic documentation milega:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Yahan se aap API test bhi kar sakte ho! 🎯
