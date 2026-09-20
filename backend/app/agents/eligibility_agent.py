class EligibilityAgent:
    async def assess(self, tender_id: int) -> dict[str, object]:
        return {"tender_id": tender_id, "eligible": True}
