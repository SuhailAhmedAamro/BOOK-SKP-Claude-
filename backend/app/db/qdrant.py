from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from typing import List, Dict, Any
from functools import lru_cache
from app.config import get_settings

settings = get_settings()


@lru_cache()
def get_qdrant_client() -> QdrantClient:
    """Get or create Qdrant client"""
    return QdrantClient(
        url=settings.qdrant_url,
        api_key=settings.qdrant_api_key,
        timeout=30
    )


async def ensure_collection_exists(collection_name: str = "robotics_textbook"):
    """Ensure the Qdrant collection exists"""
    client = get_qdrant_client()

    collections = client.get_collections().collections
    collection_names = [col.name for col in collections]

    if collection_name not in collection_names:
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(
                size=1024,  # Cohere embed-english-v3.0 dimension
                distance=Distance.COSINE
            )
        )
        print(f"Created Qdrant collection: {collection_name}")
    else:
        print(f"Qdrant collection already exists: {collection_name}")


async def search_vectors(
    query_vector: List[float],
    collection_name: str = "robotics_textbook",
    top_k: int = 5,
    filter_dict: Dict[str, Any] = None
) -> List[Dict]:
    """Search for similar vectors in Qdrant"""
    client = get_qdrant_client()

    search_result = client.search(
        collection_name=collection_name,
        query_vector=query_vector,
        limit=top_k,
        query_filter=filter_dict
    )

    return [
        {
            "id": hit.id,
            "score": hit.score,
            "payload": hit.payload
        }
        for hit in search_result
    ]
