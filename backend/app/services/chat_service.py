import logging
from typing import List, Optional, Dict, Any
from app.llm.llm_service import LLMService
from app.retrieval.hybrid_search import HybridSearch

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert AI assistant specialising in government tenders, procurement, 
and contract analysis. You help businesses understand tender requirements, eligibility criteria, 
deadlines, technical specifications, and bid strategies.

Always base your answers on the provided tender document context. Be factual, structured, and concise.
If the context does not contain the answer, clearly state that."""


class ChatService:
    """RAG-powered Q&A service with conversation history support."""

    def __init__(self):
        self.llm = LLMService()
        self.search = HybridSearch()

    async def ask(
        self,
        question: str,
        tender_id: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None,
        top_k: int = 5,
    ) -> Dict[str, Any]:
        """
        Answer a question about tenders using RAG retrieval + LLM.
        Args:
            question:  User's natural-language question.
            tender_id: If provided, scope retrieval to a specific tender.
            history:   Previous conversation turns [{"role": "user/assistant", "content": "..."}].
            top_k:     Number of context chunks to retrieve.
        Returns dict with answer, sources, and metadata.
        """
        # 1. Retrieve relevant chunks
        results = await self.search.search(query=question, top_k=top_k, tender_id=tender_id)
        context_chunks = [r["text"] for r in results if r.get("text")]

        # 2. Build history context if provided
        history_text = ""
        if history:
            for turn in history[-6:]:  # Last 3 exchanges
                role = turn.get("role", "user").capitalize()
                history_text += f"{role}: {turn.get('content', '')}\n"

        # 3. Build enriched prompt
        enriched_prompt = question
        if history_text:
            enriched_prompt = f"Previous conversation:\n{history_text}\nCurrent question: {question}"

        # 4. Call LLM with context
        answer = await self.llm.generate(
            prompt=enriched_prompt,
            system_prompt=SYSTEM_PROMPT,
            context_chunks=context_chunks if context_chunks else None,
        )

        return {
            "question": question,
            "answer": answer,
            "tender_id": tender_id,
            "sources": [
                {
                    "chunk_index": r.get("metadata", {}).get("chunk_index"),
                    "score": r.get("hybrid_score", r.get("score")),
                    "preview": r.get("text", "")[:200],
                }
                for r in results
            ],
            "context_chunks_used": len(context_chunks),
        }

    async def summarize(self, tender_id: str, top_k: int = 10) -> str:
        """Generate a concise executive summary of a tender."""
        results = await self.search.search(
            query="overview objectives scope requirements deadline value",
            top_k=top_k,
            tender_id=tender_id,
        )
        context_chunks = [r["text"] for r in results if r.get("text")]
        prompt = (
            f"Write a concise executive summary (max 300 words) for tender {tender_id}. "
            "Include: purpose, key requirements, estimated value, submission deadline, and eligibility highlights."
        )
        return await self.llm.generate(prompt=prompt, context_chunks=context_chunks)

    async def compare(self, tender_ids: List[str]) -> str:
        """Compare multiple tenders side-by-side."""
        sections = []
        for tid in tender_ids:
            results = await self.search.search(
                query="requirements eligibility value deadline scope",
                top_k=5,
                tender_id=tid,
            )
            chunks = [r["text"] for r in results]
            sections.append(f"=== Tender {tid} ===\n" + "\n".join(chunks[:3]))

        combined_context = "\n\n".join(sections)
        prompt = (
            f"Compare the following {len(tender_ids)} tenders side by side. "
            "Create a structured table or list comparing: Title, Organization, Value, Deadline, "
            "Key Requirements, Eligibility Criteria. Highlight which tender is more suitable for "
            "a mid-size IT/construction company."
        )
        return await self.llm.generate(
            prompt=prompt,
            context_chunks=[combined_context],
        )
