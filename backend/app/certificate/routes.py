from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from datetime import datetime
from app.auth.utils import get_current_user
from app.db.neon import get_pool
from .generator import generate_certificate

router = APIRouter(prefix="/api/certificate", tags=["certificate"])


class AssessmentSubmission(BaseModel):
    score: float
    answers: list[int]  # User's answers for verification


class CertificateRequest(BaseModel):
    user_name: str


@router.post("/submit-assessment")
async def submit_assessment(
    submission: AssessmentSubmission,
    user_id: str = Depends(get_current_user)
):
    """Submit final assessment and record score"""
    pool = await get_pool()

    # Validate score
    if not (0 <= submission.score <= 100):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Score must be between 0 and 100"
        )

    # Check if user completed all chapters
    progress = await pool.fetch(
        """
        SELECT COUNT(*) as total_completed
        FROM chapter_progress
        WHERE user_id = $1 AND completed = true
        """,
        user_id
    )

    completed_count = progress[0]['total_completed'] if progress else 0

    if completed_count < 13:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You must complete all 13 chapters before taking the assessment. Completed: {completed_count}/13"
        )

    # Store assessment result
    await pool.execute(
        """
        INSERT INTO assessments (user_id, score, answers, completed_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET score = $2, answers = $3, completed_at = NOW()
        """,
        user_id,
        submission.score,
        submission.answers
    )

    return {
        "message": "Assessment submitted successfully",
        "score": submission.score,
        "passed": submission.score >= 70
    }


@router.post("/generate")
async def generate_certificate_endpoint(
    request: CertificateRequest,
    user_id: str = Depends(get_current_user)
):
    """Generate and download PDF certificate"""
    pool = await get_pool()

    # Get user profile
    profile = await pool.fetchrow(
        "SELECT background FROM user_profiles WHERE user_id = $1",
        user_id
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )

    # Get assessment result
    assessment = await pool.fetchrow(
        "SELECT score, completed_at FROM assessments WHERE user_id = $1",
        user_id
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must complete the final assessment before generating a certificate"
        )

    if assessment['score'] < 70:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You must score at least 70% to receive a certificate. Your score: {assessment['score']}%"
        )

    # Generate PDF certificate
    pdf_buffer = generate_certificate(
        user_name=request.user_name,
        assessment_score=assessment['score'],
        completion_date=assessment['completed_at'],
        background=profile['background']
    )

    # Return PDF as downloadable file
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=certificate_{user_id}.pdf"
        }
    )


@router.get("/status")
async def get_certificate_status(user_id: str = Depends(get_current_user)):
    """Check if user is eligible for certificate"""
    pool = await get_pool()

    # Check chapter completion
    progress = await pool.fetch(
        """
        SELECT COUNT(*) as total_completed
        FROM chapter_progress
        WHERE user_id = $1 AND completed = true
        """,
        user_id
    )

    completed_chapters = progress[0]['total_completed'] if progress else 0

    # Check assessment
    assessment = await pool.fetchrow(
        "SELECT score, completed_at FROM assessments WHERE user_id = $1",
        user_id
    )

    return {
        "chapters_completed": completed_chapters,
        "all_chapters_done": completed_chapters >= 13,
        "assessment_taken": assessment is not None,
        "assessment_score": assessment['score'] if assessment else None,
        "assessment_passed": assessment['score'] >= 70 if assessment else False,
        "eligible_for_certificate": completed_chapters >= 13 and assessment and assessment['score'] >= 70
    }
