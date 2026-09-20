from typing import List, Dict, Any, Optional
from langchain_text_splitters import RecursiveCharacterTextSplitter

class Chunker:
    """Split document text into semantic, searchable chunks with metadata."""

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 150):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            is_separator_regex=False,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

    def chunk(self, text: str, metadata: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Split raw text into chunks.
        Returns a list of dictionaries containing 'text' and 'metadata'.
        """
        if not text or not text.strip():
            return []

        base_meta = metadata or {}
        raw_chunks = self.splitter.split_text(text)
        
        chunk_objects = []
        for idx, chunk_text in enumerate(raw_chunks):
            chunk_meta = {
                **base_meta,
                "chunk_index": idx,
                "total_chunks": len(raw_chunks),
                "char_length": len(chunk_text),
            }
            chunk_objects.append({
                "text": chunk_text,
                "metadata": chunk_meta
            })
            
        return chunk_objects
