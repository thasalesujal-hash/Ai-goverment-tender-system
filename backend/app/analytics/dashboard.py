class DashboardService:
    """Compute metrics for admin analytics dashboards."""

    async def get_metrics(self) -> dict[str, object]:
        return {"tenders_count": 0, "active_users": 0}
