import sys
import os
from pathlib import Path
import re
import uuid
import cohere
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))
load_dotenv()

# Initialize Cohere & Qdrant
co = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
qdrant = QdrantClient(url=os.getenv("QDRANT_URL"), api_key=os.getenv("QDRANT_API_KEY"))

COLLECTION_NAME = "robotics_textbook"

def parse_markdown_frontmatter(content: str) -> tuple[dict, str]:
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
    match = re.match(frontmatter_pattern, content, re.DOTALL)
    if match:
        frontmatter_text = match.group(1)
        content_text = match.group(2)
        frontmatter = {line.split(':', 1)[0].strip(): line.split(':', 1)[1].strip().strip('"')
                       for line in frontmatter_text.split('\n') if ':' in line}
        return frontmatter, content_text
    return {}, content

async def ingest_chapters():
    print("Starting Ingestion with Cohere...")
    # Cohere embed-english-v3.0 uses 1024 dimensions
    qdrant.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
    )

    book_dir = Path(__file__).parent.parent.parent / "frontend" / "docs" / "BOOK"
    chapter_files = sorted(book_dir.glob("Chapter*.md"))
    total_chunks = 0

    for chapter_file in chapter_files:
        chapter_num = int(re.search(r'Chapter (\d+)', chapter_file.stem).group(1))
        content = chapter_file.read_text(encoding='utf-8')
        _, main_content = parse_markdown_frontmatter(content)

        # Simple split by sections
        sections = re.split(r'\n## ', main_content)
        for idx, section in enumerate(sections):
            try:
                # Get Cohere Embedding
                result = co.embed(
                    texts=[section],
                    model="embed-english-v3.0",
                    input_type="search_document"
                )

                # FIX: Use UUID to avoid Qdrant ID error
                point_id = str(uuid.uuid4())

                qdrant.upsert(
                    collection_name=COLLECTION_NAME,
                    points=[PointStruct(id=point_id, vector=result.embeddings[0], payload={"chapter": chapter_num, "content": section})]
                )
                total_chunks += 1
            except Exception as e:
                print(f"Error: {e}")
        print(f"Processed Chapter {chapter_num}")
    print(f"Done! Total chunks: {total_chunks}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(ingest_chapters())
