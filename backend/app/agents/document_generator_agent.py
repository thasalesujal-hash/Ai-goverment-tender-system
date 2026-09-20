class DocumentGeneratorAgent:
    async def generate(self, tender_id: int) -> str:
        return f"Document for tender {tender_id}"
