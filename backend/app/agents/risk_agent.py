class RiskAnalysisAgent:
    async def analyze(self, tender_id: int) -> dict[str, object]:
        return {"tender_id": tender_id, "risk_level": "medium"}
