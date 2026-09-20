class PromptBuilder:
    """Construct domain-specific prompts for LLM workflows."""

    def build(self, query: str, context: list[str]) -> str:
        return f"Question: {query}\nContext: {' | '.join(context)}"
