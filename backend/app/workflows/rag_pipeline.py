class RAGPipeline:
    """Coordinate OCR, chunking, embeddings, retrieval and LLM answer generation."""

    async def run(self, document_path: str, query: str) -> dict[str, object]:
        return {"document_path": document_path, "query": query, "answer": "RAG answer placeholder"}
