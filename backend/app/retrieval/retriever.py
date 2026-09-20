from typing import List, Dict, Any, Optional
from app.embeddings.embedding_service import EmbeddingService
from app.vectorstore.qdrant_client import QdrantService

class Retriever:
    """Retrieve relevant chunks from vector store using semantic search."""

    def __init__(
        self,
        embedding_service: Optional[EmbeddingService] = None,
        qdrant_service: Optional[QdrantService] = None
    ):
        self.embedding_service = embedding_service or EmbeddingService()
        self.qdrant_service = qdrant_service or QdrantService()

    async def retrieve(
        self,
        query: str,
        top_k: int = 5,
        tender_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Embed the search query and perform similarity search against stored tender chunks.
        """
        if not query or not query.strip():
            return []

        query_vector = await self.embedding_service.embed_query(query)
        results = await self.qdrant_service.search(
            query_vector=query_vector,
            top_k=top_k,
            tender_id=tender_id
        )
        return results
