import hashlib
import logging
from typing import List
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmbeddingService:
    """Generate vector embeddings for tender chunks and search queries."""

    def __init__(self, model_name: str = "text-embedding-3-small", vector_dim: int = 1536):
        self.model_name = model_name
        self.vector_dim = vector_dim
        self.api_key = settings.openai_api_key

    async def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts."""
        if not texts:
            return []

        if self.api_key:
            try:
                import httpx
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        "https://api.openai.com/v1/embeddings",
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "input": texts,
                            "model": self.model_name
                        },
                        timeout=30.0
                    )
                    response.raise_for_status()
                    data = response.json()
                    return [item["embedding"] for item in data["data"]]
            except Exception as e:
                logger.warning(f"OpenAI embedding call failed ({e}), falling back to deterministic local embeddings.")

        # Fallback local deterministic embedding generator for development/offline mode
        return [self._local_fallback_embed(text) for text in texts]

    async def embed_query(self, query: str) -> List[float]:
        """Generate embedding for a single search query."""
        results = await self.embed_texts([query])
        return results[0] if results else [0.0] * self.vector_dim

    def _local_fallback_embed(self, text: str) -> List[float]:
        """Generate a deterministic normalized vector based on text hash for offline testing."""
        vec = []
        # Generate pseudo-random float vector from text hash
        h = hashlib.sha256(text.encode("utf-8")).digest()
        for i in range(self.vector_dim):
            byte_val = h[i % len(h)]
            val = (byte_val / 255.0) * 2.0 - 1.0 # Scale to [-1, 1]
            vec.append(val)
        
        # Simple L2 normalization
        norm = sum(x * x for x in vec) ** 0.5
        if norm > 0:
            vec = [x / norm for x in vec]
            
        return vec
