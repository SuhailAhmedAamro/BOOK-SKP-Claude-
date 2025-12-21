import asyncpg
from typing import Optional
from app.config import get_settings

settings = get_settings()

# Database connection pool
_pool: Optional[asyncpg.Pool] = None


async def get_pool() -> asyncpg.Pool:
    """Get or create the connection pool"""
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            settings.database_url,
            min_size=1,
            max_size=10,
            command_timeout=60
        )
    return _pool


async def get_db_connection():
    """Get a database connection from the pool"""
    pool = await get_pool()
    async with pool.acquire() as connection:
        yield connection


async def close_pool():
    """Close the connection pool"""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
