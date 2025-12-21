import os
import google.generativeai as genai
from typing import List, Dict, Optional
from app.config import get_settings
from app.db.qdrant import search_vectors

settings = get_settings()

# Gemini setup using the key from .env
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_personalization_context(background: str) -> str:
    """Get personalized context based on user's background"""
    if background == "Hardware":
        return """
        Focus on hardware: NVIDIA Jetson Orin, Intel RealSense, sensors, actuators, and wiring.
        Emphasize practical, hands-on hardware implementation.
        """
    elif background == "Software":
        return """
        Focus on software: ROS 2 nodes, Python/C++, Gazebo, Isaac Sim, and algorithms.
        Emphasize code examples and software architecture.
        """
    return "Provide balanced coverage of both hardware and software aspects."

async def generate_embedding(text: str) -> List[float]:
    """Generate embedding for text using Google Gemini"""
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="retrieval_query"
    )
    return result['embedding']

async def search_similar_content(
    query: str,
    top_k: int = 5,
    chapter_filter: Optional[int] = None
) -> List[Dict]:
    """Search for similar content in Qdrant"""
    query_embedding = await generate_embedding(query)

    filter_dict = None
    if chapter_filter:
        filter_dict = {
            "must": [{"key": "chapter", "match": {"value": chapter_filter}}]
        }

    results = await search_vectors(
        query_vector=query_embedding,
        top_k=top_k,
        filter_dict=filter_dict
    )
    return results

async def generate_rag_response(
    message: str,
    background: str,
    selected_text: Optional[str] = None,
    chapter_number: Optional[int] = None
) -> tuple[str, List[Dict]]:
    """Generate RAG response using Gemini 1.5 Flash"""

    query = f"{selected_text}\n\nQuestion: {message}" if selected_text else message
    
    # Search relevant context from Qdrant Cloud
    search_results = await search_similar_content(
        query=query,
        top_k=5,
        chapter_filter=chapter_number
    )

    context_text = "\n".join([res['payload']['content'] for res in search_results])
    personalization = get_personalization_context(background)

    # Prompt for Gemini
    prompt = f"""You are an expert AI assistant for the "Physical AI & Humanoid Robotics" textbook.
    
    {personalization}
    
    Context: {context_text}
    
    Guidelines:
    - Answer ONLY based on the context.
    - Cite chapter numbers if available.
    - Keep it concise.
    
    User Question: {message}"""

    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)

    sources = [
        {
            "chapter": res['payload'].get('chapter', 'N/A'),
            "excerpt": res['payload']['content'][:200] + "...",
            "score": res['score']
        }
        for res in search_results[:3]
    ]

    return response.text, sources

async def translate_to_urdu(text: str) -> str:
    """Translate text to Urdu using Gemini"""
    prompt = f"""Translate the following text to Urdu (اردو) but keep technical terms like 
    ROS 2, NVIDIA, Jetson Orin, Python, and Linux in English.
    
    Text: {text}
    
    Urdu Translation:"""
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    return response.text