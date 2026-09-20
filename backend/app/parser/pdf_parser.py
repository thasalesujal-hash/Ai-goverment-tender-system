class PDFParser:
    """Parse tender PDFs and extract text."""

    async def parse(self, file_path: str) -> str:
        return f"Parsed content from {file_path}"
