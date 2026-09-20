class Reranker:
    """Re-rank retrieved results before sending them to the LLM."""

    async def rerank(self, documents: list[str]) -> list[str]:
        return documents
