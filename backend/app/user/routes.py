from fastapi import APIRouter, HTTPException, status, Depends
from app.user.models import ProfileCreate, ProfileResponse, ChapterProgressUpdate, ChapterProgressResponse, UserProgressResponse
from app.auth.utils import get_current_user
from app.db.neon import get_pool

router = APIRouter(prefix="/api/user", tags=["user"])


@router.post("/profile", response_model=ProfileResponse)
async def create_profile(profile_data: ProfileCreate, user_id: str = Depends(get_current_user)):
    """Create or update user profile with background (Software/Hardware)"""
    pool = await get_pool()

    # Validate background
    if profile_data.background not in ["Software", "Hardware"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Background must be 'Software' or 'Hardware'"
        )

    # Check if profile exists
    existing_profile = await pool.fetchrow(
        "SELECT user_id FROM user_profiles WHERE user_id = $1",
        user_id
    )

    if existing_profile:
        # Update existing profile
        await pool.execute(
            """
            UPDATE user_profiles
            SET background = $1, updated_at = NOW()
            WHERE user_id = $2
            """,
            profile_data.background,
            user_id
        )
    else:
        # Create new profile
        await pool.execute(
            """
            INSERT INTO user_profiles (user_id, background, created_at, updated_at)
            VALUES ($1, $2, NOW(), NOW())
            """,
            user_id,
            profile_data.background
        )

    # Fetch profile
    profile = await pool.fetchrow(
        "SELECT user_id, background, created_at FROM user_profiles WHERE user_id = $1",
        user_id
    )

    return ProfileResponse(
        user_id=profile["user_id"],
        background=profile["background"],
        created_at=profile["created_at"]
    )


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(user_id: str = Depends(get_current_user)):
    """Get user profile"""
    pool = await get_pool()

    profile = await pool.fetchrow(
        "SELECT user_id, background, created_at FROM user_profiles WHERE user_id = $1",
        user_id
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete your profile setup."
        )

    return ProfileResponse(
        user_id=profile["user_id"],
        background=profile["background"],
        created_at=profile["created_at"]
    )


@router.post("/progress", status_code=status.HTTP_201_CREATED)
async def update_progress(progress_data: ChapterProgressUpdate, user_id: str = Depends(get_current_user)):
    """Update chapter progress"""
    pool = await get_pool()

    # Validate chapter number
    if not (1 <= progress_data.chapter_number <= 13):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chapter number must be between 1 and 13"
        )

    # Upsert progress
    await pool.execute(
        """
        INSERT INTO chapter_progress (user_id, chapter_number, completed, last_accessed)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, chapter_number)
        DO UPDATE SET completed = $3, last_accessed = NOW()
        """,
        user_id,
        progress_data.chapter_number,
        progress_data.completed
    )

    return {"message": "Progress updated successfully"}


@router.get("/progress", response_model=UserProgressResponse)
async def get_progress(user_id: str = Depends(get_current_user)):
    """Get user's chapter progress"""
    pool = await get_pool()

    chapters = await pool.fetch(
        """
        SELECT chapter_number, completed, last_accessed
        FROM chapter_progress
        WHERE user_id = $1
        ORDER BY chapter_number
        """,
        user_id
    )

    chapter_list = [
        ChapterProgressResponse(
            chapter_number=ch["chapter_number"],
            completed=ch["completed"],
            last_accessed=ch["last_accessed"]
        )
        for ch in chapters
    ]

    # Calculate completion percentage
    total_chapters = 13
    completed_count = sum(1 for ch in chapter_list if ch.completed)
    completion_percentage = (completed_count / total_chapters) * 100

    return UserProgressResponse(
        chapters=chapter_list,
        completion_percentage=completion_percentage
    )
