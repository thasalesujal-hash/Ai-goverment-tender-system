class ComplianceAgent:
    async def analyze(self, tender_id: int) -> dict[str, object]:
        return {"tender_id": tender_id, "compliance": "pass"}
