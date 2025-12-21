from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProfileCreate(BaseModel):
    background: str  # "Software" or "Hardware"


class ProfileResponse(BaseModel):
    user_id: str
    background: str
    created_at: datetime


class ChapterProgressUpdate(BaseModel):
    chapter_number: int
    completed: bool


class ChapterProgressResponse(BaseModel):
    chapter_number: int
    completed: bool
    last_accessed: datetime


class UserProgressResponse(BaseModel):
    chapters: List[ChapterProgressResponse]
    completion_percentage: float
