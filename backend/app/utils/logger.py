import logging
import sys
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger("physical-ai-api")


def log_request(endpoint: str, user_id: str = None, duration: float = None):
    """Log API request with details"""
    logger.info(
        f"API Request: {endpoint} | User: {user_id or 'anonymous'} | Duration: {duration or 'N/A'}s"
    )


def log_error(error: Exception, context: str = None):
    """Log error with context"""
    logger.error(
        f"Error in {context or 'unknown'}: {type(error).__name__} - {str(error)}"
    )


def log_chat_interaction(user_id: str, query_length: int, response_length: int, sources_count: int):
    """Log chat interaction metrics"""
    logger.info(
        f"Chat Interaction | User: {user_id} | "
        f"Query: {query_length} chars | Response: {response_length} chars | "
        f"Sources: {sources_count}"
    )
