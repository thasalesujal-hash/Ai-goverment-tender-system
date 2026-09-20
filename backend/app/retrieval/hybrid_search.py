import re
from typing import List, Dict, Any, Optional
from app.retrieval.retriever import Retriever

class HybridSearch:
    """Hybrid search combining keyword term matching and dense vector semantic search using RRF."""

    def __init__(self, retriever: Optional[Retriever] = None):
        self.retriever = retriever or Retriever()

    async def search(
        self,
        query: str,
        top_k: int = 5,
        tender_id: Optional[str] = None,
        vector_weight: float = 0.7,
        keyword_weight: float = 0.3
    ) -> List[Dict[str, Any]]:
        """Perform hybrid search over indexed tender chunks."""
        # 1. Fetch vector search results
        vector_results = await self.retriever.retrieve(
            query=query,
            top_k=top_k * 2,
            tender_id=tender_id
        )

        if not vector_results:
            return []

        # 2. Compute keyword similarity scores (simple BM25-like overlap)
        query_terms = set(re.findall(r'\w+', query.lower()))

        scored_results = []
        for rank_idx, doc in enumerate(vector_results):
            text = doc.get("text", "").lower()
            doc_terms = set(re.findall(r'\w+', text))
            
            # Term overlap score
            overlap = len(query_terms.intersection(doc_terms))
            kw_score = overlap / (len(query_terms) + 1e-5)

            # Combine vector score + keyword score
            vec_score = doc.get("score", 0.0)
            hybrid_score = (vector_weight * vec_score) + (keyword_weight * kw_score)

            item = dict(doc)
            item["hybrid_score"] = round(float(hybrid_score), 4)
            scored_results.append(item)

        # 3. Sort by hybrid score
        scored_results.sort(key=lambda x: x["hybrid_score"], reverse=True)
        return scored_results[:top_k]
