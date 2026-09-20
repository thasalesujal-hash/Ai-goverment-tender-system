class FinancialAgent:
    async def analyze(self, tender_id: int) -> dict[str, object]:
        return {"tender_id": tender_id, "financial_risk": "medium"}
