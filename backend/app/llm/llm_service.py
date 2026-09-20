import logging
from typing import List, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMService:
    """Wrapper for LLM providers: OpenAI GPT-4o (primary) with mock fallback."""

    def __init__(self):
        self.api_key = settings.openai_api_key
        self.model = "gpt-4o-mini"
        self.base_url = "https://api.openai.com/v1/chat/completions"

    async def generate(
        self,
        prompt: str,
        system_prompt: str = "You are a helpful AI assistant for government tender analysis.",
        context_chunks: Optional[List[str]] = None,
        max_tokens: int = 1500,
    ) -> str:
        """
        Call the LLM with an optional list of context chunks (RAG-retrieved).
        Falls back to mock response if no API key is configured.
        """
        if not self.api_key:
            logger.warning("No OpenAI API key — returning mock LLM response.")
            return self._mock_response(prompt, context_chunks)

        # Build messages
        messages = [{"role": "system", "content": system_prompt}]

        if context_chunks:
            context_block = "\n\n---\n\n".join(context_chunks)
            messages.append({
                "role": "user",
                "content": f"Use the following tender document excerpts as context:\n\n{context_block}\n\n---\n\nQuestion: {prompt}"
            })
        else:
            messages.append({"role": "user", "content": prompt})

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": messages,
                        "max_tokens": max_tokens,
                        "temperature": 0.3,
                    }
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"].strip()
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            return self._mock_response(prompt, context_chunks)

    def _mock_response(self, prompt: str, context_chunks: Optional[List[str]]) -> str:
        ctx_note = f" ({len(context_chunks)} context chunks used)" if context_chunks else ""
        return (
            f"[MOCK LLM RESPONSE{ctx_note}]\n"
            f"Query: {prompt[:120]}...\n"
            f"To get real AI responses, please configure your OPENAI_API_KEY in backend/.env"
        )
