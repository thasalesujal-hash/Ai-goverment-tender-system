import pytest
from app.chunking.chunker import Chunker
from app.embeddings.embedding_service import EmbeddingService
from app.ocr.extractor import DocumentExtractor
from app.retrieval.hybrid_search import HybridSearch

@pytest.mark.asyncio
async def test_chunker_basic():
    chunker = Chunker(chunk_size=100, chunk_overlap=20)
    sample_text = "This is a government tender notice for road construction. " * 5
    chunks = chunker.chunk(sample_text, metadata={"tender_id": "TEND-123"})
    
    assert len(chunks) > 0
    assert chunks[0]["metadata"]["tender_id"] == "TEND-123"
    assert "text" in chunks[0]

@pytest.mark.asyncio
async def test_embedding_fallback():
    embedder = EmbeddingService(vector_dim=1536)
    vecs = await embedder.embed_texts(["Highway construction bid document"])
    
    assert len(vecs) == 1
    assert len(vecs[0]) == 1536

@pytest.mark.asyncio
async def test_document_extractor_empty_fallback():
    extractor = DocumentExtractor()
    # Dummy pdf-like bytes
    extracted = await extractor._extract_with_ocr(b"dummy pdf bytes")
    assert isinstance(extracted, str)
