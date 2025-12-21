from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from collections import defaultdict
from datetime import datetime, timedelta
import asyncio

# Simple in-memory rate limiter
# For production, use Redis
class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)
        self.cleanup_task = None

    def check_rate_limit(
        self,
        identifier: str,
        max_requests: int = 10,
        window_seconds: int = 60
    ) -> bool:
        """
        Check if request is within rate limit

        Args:
            identifier: Usually IP address or user ID
            max_requests: Maximum requests allowed
            window_seconds: Time window in seconds

        Returns:
            True if within limit, False otherwise
        """
        now = datetime.now()
        window_start = now - timedelta(seconds=window_seconds)

        # Clean old requests
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if req_time > window_start
        ]

        # Check limit
        if len(self.requests[identifier]) >= max_requests:
            return False

        # Add current request
        self.requests[identifier].append(now)
        return True

    async def cleanup_old_entries(self):
        """Periodically cleanup old entries to prevent memory leak"""
        while True:
            await asyncio.sleep(300)  # Every 5 minutes
            now = datetime.now()
            cutoff = now - timedelta(hours=1)

            for identifier in list(self.requests.keys()):
                self.requests[identifier] = [
                    req_time for req_time in self.requests[identifier]
                    if req_time > cutoff
                ]
                if not self.requests[identifier]:
                    del self.requests[identifier]


# Global rate limiter instance
rate_limiter = RateLimiter()


async def rate_limit_middleware(request: Request, call_next):
    """
    Rate limiting middleware
    Limits requests per IP address
    """
    # Skip rate limiting for health checks
    if request.url.path in ["/", "/api/health"]:
        return await call_next(request)

    # Get client IP
    client_ip = request.client.host

    # Check rate limit (10 requests per minute per IP)
    if not rate_limiter.check_rate_limit(client_ip, max_requests=10, window_seconds=60):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "detail": "Too many requests. Please try again in a minute."
            }
        )

    response = await call_next(request)
    return response
