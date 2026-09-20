import logging
from typing import Dict, Any, Optional
from app.llm.llm_service import LLMService
from app.retrieval.hybrid_search import HybridSearch

logger = logging.getLogger(__name__)

ELIGIBILITY_SYSTEM_PROMPT = """You are a government procurement compliance expert. 
Analyse tender eligibility requirements and assess whether a company profile meets them.
Be precise. Return your output as structured JSON with the following keys:
- eligible: true/false
- score: float between 0.0 and 1.0 (1.0 = fully eligible)
- met_criteria: list of criteria the company meets
- unmet_criteria: list of criteria the company does NOT meet
- recommendations: list of steps to improve eligibility
- summary: a 2-3 sentence plain English explanation"""


class EligibilityService:
    """Assess company eligibility for a given tender using LLM + RAG."""

    def __init__(self):
        self.llm = LLMService()
        self.search = HybridSearch()

    async def assess(
        self,
        tender_id: str,
        company_profile: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Evaluate a company profile against the tender eligibility criteria.
        Args:
            tender_id:       The tender to assess against.
            company_profile: Dict with keys like: name, turnover, years_in_business,
                             registrations (list), sectors (list), certifications (list).
        Returns structured eligibility report.
        """
        # Retrieve eligibility-relevant chunks
        results = await self.search.search(
            query="eligibility criteria qualifications turnover experience registration certificate",
            top_k=8,
            tender_id=tender_id,
        )
        context_chunks = [r["text"] for r in results if r.get("text")]

        # Default company profile if not provided
        profile = company_profile or {
            "name": "Your Company",
            "turnover": "Not specified",
            "years_in_business": "Not specified",
            "registrations": [],
            "sectors": [],
            "certifications": [],
        }

        profile_text = "\n".join([f"- {k}: {v}" for k, v in profile.items()])

        prompt = (
            f"Tender ID: {tender_id}\n\n"
            f"Company Profile:\n{profile_text}\n\n"
            "Based on the tender document context, assess if this company is eligible to bid. "
            "Return your response as a JSON object with the keys: "
            "eligible, score, met_criteria, unmet_criteria, recommendations, summary."
        )

        raw_response = await self.llm.generate(
            prompt=prompt,
            system_prompt=ELIGIBILITY_SYSTEM_PROMPT,
            context_chunks=context_chunks or None,
        )

        # Try to parse LLM JSON; fall back gracefully
        try:
            import json, re
            json_match = re.search(r'\{[\s\S]+\}', raw_response)
            if json_match:
                parsed = json.loads(json_match.group())
                parsed["tender_id"] = tender_id
                return parsed
        except Exception:
            pass

        # Fallback structured response
        return {
            "tender_id": tender_id,
            "eligible": None,
            "score": 0.0,
            "met_criteria": [],
            "unmet_criteria": [],
            "recommendations": ["Configure OPENAI_API_KEY for real eligibility analysis."],
            "summary": raw_response,
        }
