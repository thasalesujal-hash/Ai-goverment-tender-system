import logging
from typing import Dict, Any, Optional
from app.llm.llm_service import LLMService
from app.retrieval.hybrid_search import HybridSearch

logger = logging.getLogger(__name__)

BID_SYSTEM_PROMPT = """You are an expert bid writer specialising in government procurement and 
public tenders. Your task is to write a professional, compliant, and compelling bid document.

Structure your response with these sections:
1. Executive Summary
2. Company Profile & Relevant Experience
3. Technical Approach & Methodology
4. Project Team & Key Personnel
5. Timeline & Deliverables
6. Pricing Strategy Overview
7. Compliance Statement

Write in formal, professional language suitable for government submission."""


class BidService:
    """Generate structured bid documents using RAG + LLM."""

    def __init__(self):
        self.llm = LLMService()
        self.search = HybridSearch()

    async def generate(
        self,
        tender_id: str,
        company_profile: Optional[Dict[str, Any]] = None,
        additional_context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate a bid document for the given tender.
        Args:
            tender_id:          Tender to generate a bid for.
            company_profile:    Dict with company name, sector, past projects, etc.
            additional_context: Any extra details the user wants included.
        Returns dict with bid content and metadata.
        """
        # Retrieve tender scope, requirements and evaluation criteria
        results = await self.search.search(
            query="scope of work technical requirements deliverables evaluation criteria submission format",
            top_k=10,
            tender_id=tender_id,
        )
        context_chunks = [r["text"] for r in results if r.get("text")]

        # Build company profile text
        profile = company_profile or {
            "name": "Your Company Pvt. Ltd.",
            "sector": "Technology & Infrastructure",
            "years_in_business": 10,
            "past_projects": ["Government ERP implementation", "Smart City surveillance system"],
            "certifications": ["ISO 9001:2015", "CMMI Level 3"],
        }
        profile_text = "\n".join([f"- {k}: {v}" for k, v in profile.items()])

        extra = f"\n\nAdditional context from bidder:\n{additional_context}" if additional_context else ""

        prompt = (
            f"Generate a complete bid response document for Tender ID: {tender_id}\n\n"
            f"Our Company Profile:\n{profile_text}{extra}\n\n"
            "Write a professional, detailed bid document covering all required sections."
        )

        bid_content = await self.llm.generate(
            prompt=prompt,
            system_prompt=BID_SYSTEM_PROMPT,
            context_chunks=context_chunks or None,
            max_tokens=2000,
        )

        return {
            "tender_id": tender_id,
            "company_name": profile.get("name", "Unknown"),
            "status": "draft",
            "bid_content": bid_content,
            "sections": [
                "Executive Summary",
                "Company Profile & Relevant Experience",
                "Technical Approach & Methodology",
                "Project Team & Key Personnel",
                "Timeline & Deliverables",
                "Pricing Strategy Overview",
                "Compliance Statement",
            ],
            "context_chunks_used": len(context_chunks),
        }
