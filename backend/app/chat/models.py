from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatRequest(BaseModel):
    message: str
    selected_text: Optional[str] = None
    chapter_number: Optional[int] = None
    session_id: str


class Source(BaseModel):
    chapter: int
    section: str
    excerpt: str
    score: float


class ChatResponse(BaseModel):
    message: str
    sources: List[Source]


class TranslateRequest(BaseModel):
    text: str
    target_lang: str = "ur"


class TranslateResponse(BaseModel):
    translated: str
