from fastapi import APIRouter, HTTPException, status, Depends
from app.auth.models import UserCreate, UserLogin, Token, UserResponse
from app.auth.utils import get_password_hash, verify_password, create_access_token, get_current_user
from app.db.neon import get_pool
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=Token)
async def signup(user_data: UserCreate):
    """Register a new user"""
    pool = await get_pool()

    # Check if user already exists
    existing_user = await pool.fetchrow(
        "SELECT id FROM users WHERE email = $1",
        user_data.email
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)

    await pool.execute(
        """
        INSERT INTO users (id, email, hashed_password, name, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        """,
        user_id,
        user_data.email,
        hashed_password,
        user_data.name
    )

    # Fetch created user
    user = await pool.fetchrow(
        "SELECT id, email, name, created_at FROM users WHERE id = $1",
        user_id
    )

    # Create access token
    access_token = create_access_token(data={"sub": user_id})

    # Create session
    session_id = str(uuid.uuid4())
    await pool.execute(
        """
        INSERT INTO sessions (id, user_id, token, expires_at)
        VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')
        """,
        session_id,
        user_id,
        access_token
    )

    return Token(
        access_token=access_token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            created_at=user["created_at"]
        )
    )


@router.post("/signin", response_model=Token)
async def signin(credentials: UserLogin):
    """Login an existing user"""
    pool = await get_pool()

    # Find user
    user = await pool.fetchrow(
        "SELECT id, email, name, hashed_password, created_at FROM users WHERE email = $1",
        credentials.email
    )

    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create access token
    access_token = create_access_token(data={"sub": user["id"]})

    # Create session
    session_id = str(uuid.uuid4())
    await pool.execute(
        """
        INSERT INTO sessions (id, user_id, token, expires_at)
        VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')
        """,
        session_id,
        user["id"],
        access_token
    )

    return Token(
        access_token=access_token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            created_at=user["created_at"]
        )
    )


@router.post("/signout")
async def signout(user_id: str = Depends(get_current_user)):
    """Logout the current user"""
    pool = await get_pool()

    # Delete all sessions for this user
    await pool.execute(
        "DELETE FROM sessions WHERE user_id = $1",
        user_id
    )

    return {"message": "Successfully signed out"}


@router.get("/session", response_model=UserResponse)
async def get_session(user_id: str = Depends(get_current_user)):
    """Get the current user's session"""
    pool = await get_pool()

    user = await pool.fetchrow(
        "SELECT id, email, name, created_at FROM users WHERE id = $1",
        user_id
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        created_at=user["created_at"]
    )
