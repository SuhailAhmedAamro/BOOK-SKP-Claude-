from fastapi import APIRouter, HTTPException, status, Depends
from app.chat.models import ChatRequest, ChatResponse, Source, TranslateRequest, TranslateResponse
from app.chat.rag_service import generate_rag_response, translate_to_urdu
from app.auth.utils import get_current_user
from app.db.neon import get_pool
from app.utils.logger import log_chat_interaction, log_error
import json
import time

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest, user_id: str = Depends(get_current_user)):
    """
    Chat endpoint with RAG (Retrieval-Augmented Generation)
    Supports personalization based on user profile and selected text
    """
    pool = await get_pool()

    # Get user profile for personalization
    profile = await pool.fetchrow(
        "SELECT background FROM user_profiles WHERE user_id = $1",
        user_id
    )

    background = profile["background"] if profile else "Software"  # Default to Software

    start_time = time.time()

    try:
        # Generate RAG response
        response_text, sources = await generate_rag_response(
            message=request.message,
            background=background,
            selected_text=request.selected_text,
            chapter_number=request.chapter_number
        )

        # Save to chat history
        await pool.execute(
            """
            INSERT INTO chat_history
            (user_id, session_id, chapter_number, selected_text, user_message, assistant_response, sources, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            """,
            user_id,
            request.session_id,
            request.chapter_number,
            request.selected_text,
            request.message,
            response_text,
            json.dumps(sources)
        )

        # Log interaction
        duration = time.time() - start_time
        log_chat_interaction(
            user_id=user_id,
            query_length=len(request.message),
            response_length=len(response_text),
            sources_count=len(sources)
        )

        # Convert sources to Pydantic models
        source_objects = [
            Source(
                chapter=src["chapter"],
                section=src["section"],
                excerpt=src["excerpt"],
                score=src["score"]
            )
            for src in sources
        ]

        return ChatResponse(
            message=response_text,
            sources=source_objects
        )

    except Exception as e:
        log_error(e, context="chat_endpoint")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate response. Please try again."
        )


@router.get("/history")
async def get_chat_history(
    session_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get chat history for a specific session"""
    pool = await get_pool()

    messages = await pool.fetch(
        """
        SELECT user_message, assistant_response, selected_text, chapter_number, created_at
        FROM chat_history
        WHERE user_id = $1 AND session_id = $2
        ORDER BY created_at ASC
        """,
        user_id,
        session_id
    )

    return {
        "messages": [
            {
                "user_message": msg["user_message"],
                "assistant_response": msg["assistant_response"],
                "selected_text": msg["selected_text"],
                "chapter_number": msg["chapter_number"],
                "created_at": msg["created_at"].isoformat()
            }
            for msg in messages
        ]
    }


@router.post("/translate", response_model=TranslateResponse)
async def translate(
    request: TranslateRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Translate text to Urdu while preserving technical terms
    """
    if request.target_lang != "ur":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only Urdu translation is supported currently"
        )

    try:
        translated_text = await translate_to_urdu(request.text)
        return TranslateResponse(translated=translated_text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation error: {str(e)}"
        )
