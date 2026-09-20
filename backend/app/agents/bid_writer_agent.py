class BidWriterAgent:
    async def write(self, tender_id: int) -> str:
        return f"Draft bid for tender {tender_id}"
