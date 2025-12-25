from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str
    qdrant_url: str
    qdrant_api_key: str
    cohere_api_key: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080
    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    return Settings()