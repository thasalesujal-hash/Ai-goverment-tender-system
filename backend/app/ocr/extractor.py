import pdfplumber
import fitz # PyMuPDF
import io
import logging

logger = logging.getLogger(__name__)

class DocumentExtractor:
    """Extracts text from PDF documents. Falls back to OCR if needed."""

    def __init__(self):
        # Initialize OCR service if needed, e.g., PaddleOCR
        pass

    async def extract_text(self, file_content: bytes) -> str:
        """
        Extract text from PDF byte content.
        Uses pdfplumber to extract text. If the text is too short,
        it might be a scanned document, which requires OCR.
        """
        text = ""
        try:
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                        
            if len(text.strip()) < 50:
                logger.info("Very little text found, might be a scanned PDF. Triggering OCR...")
                text = await self._extract_with_ocr(file_content)
                
            return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            raise e

    async def _extract_with_ocr(self, file_content: bytes) -> str:
        """Fallback to OCR for scanned PDFs."""
        # TODO: Implement PaddleOCR or Tesseract extraction on pdf pages
        return "OCR Text Extraction not fully implemented yet."
