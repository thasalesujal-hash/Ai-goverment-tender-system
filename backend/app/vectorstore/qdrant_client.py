import uuid
import logging
from typing import List, Dict, Any, Optional
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from app.core.config import settings

logger = logging.getLogger(__name__)

class QdrantService:
    """Interface for Qdrant vector database operations."""

    def __init__(self, collection_name: str = "tender_chunks", vector_size: int = 1536):
        self.collection_name = collection_name
        self.vector_size = vector_size
        self.client = AsyncQdrantClient(url=settings.qdrant_url)

    async def ensure_collection(self):
        """Create the Qdrant collection if it does not exist."""
        try:
            collections = await self.client.get_collections()
            collection_names = [c.name for c in collections.collections]
            if self.collection_name not in collection_names:
                logger.info(f"Creating collection {self.collection_name} with vector size {self.vector_size}")
                await self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
                )
        except Exception as e:
            logger.error(f"Error ensuring Qdrant collection {self.collection_name}: {e}")

    async def upsert_chunks(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]) -> List[str]:
        """
        Upsert document chunks and their embeddings into Qdrant.
        Each chunk item should have 'text' and 'metadata'.
        """
        await self.ensure_collection()
        points = []
        point_ids = []

        for chunk, vector in zip(chunks, embeddings):
            point_id = str(uuid.uuid4())
            point_ids.append(point_id)
            payload = {
                "text": chunk["text"],
                **(chunk.get("metadata") or {})
            }
            points.append(
                PointStruct(
                    id=point_id,
                    vector=vector,
                    payload=payload
                )
            )

        if points:
            await self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            logger.info(f"Successfully upserted {len(points)} points into Qdrant collection {self.collection_name}")

        return point_ids

    async def search(
        self,
        query_vector: List[float],
        top_k: int = 5,
        tender_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Search for top_k relevant chunks, with optional tender_id payload filtering."""
        await self.ensure_collection()

        query_filter = None
        if tender_id:
            query_filter = Filter(
                must=[
                    FieldCondition(
                        key="tender_id",
                        match=MatchValue(value=tender_id)
                    )
                ]
            )

        results = await self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k,
            query_filter=query_filter
        )

        matches = []
        for res in results:
            matches.append({
                "id": str(res.id),
                "score": res.score,
                "text": res.payload.get("text", "") if res.payload else "",
                "metadata": res.payload or {}
            })

        return matches
