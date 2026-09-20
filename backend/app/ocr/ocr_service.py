class OCRService:
    """OCR service for scanned tender documents."""

    async def extract(self, file_path: str) -> str:
        return f"OCR output for {file_path}"
