from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import asyncio

from app.config import get_settings
from app.db.neon import get_pool, close_pool
from app.db.qdrant import ensure_collection_exists
from app.auth.routes import router as auth_router
from app.user.routes import router as user_router
from app.chat.routes import router as chat_router
from app.certificate.routes import router as certificate_router
from app.middleware.rate_limit import rate_limit_middleware, rate_limiter

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    print("[*] Starting up...")
    await get_pool()
    print("[+] Database connection pool created")
    await ensure_collection_exists()
    print("[+] Qdrant collection verified")
    cleanup_task = asyncio.create_task(rate_limiter.cleanup_old_entries())
    print("[+] Rate limiter initialized")
    print("[*] Application ready!")
    yield
    print("[-] Shutting down...")
    cleanup_task.cancel()
    await close_pool()
    print("[+] Database connection pool closed")
    print("[*] Shutdown complete")

app = FastAPI(
    title="Physical AI RAG Chatbot API",
    description="Backend API for the Physical AI & Humanoid Robotics textbook",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# --- MIDDLEWARE ORDER (IMPORTANT) ---

# 1. CORS Middleware (Sabse pehle rakhein taaki errors par bhi headers milein)
# Build CORS origins list from environment
cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
# Add production frontend URL if set
if settings.frontend_url and settings.frontend_url not in cors_origins:
    cors_origins.append(settings.frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Rate limiting middleware
app.middleware("http")(rate_limit_middleware)

# 3. Trusted host middleware
if settings.frontend_url != "http://localhost:3000":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*.vercel.app", "localhost", "127.0.0.1"]
    )

# --- ROUTES ---
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(chat_router)
app.include_router(certificate_router)

@app.get("/")
async def root():
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    pool = await get_pool()
    try:
        await pool.fetchval("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return {"status": "healthy", "database": db_status}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)