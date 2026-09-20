class RateLimiter:
    """Simple in-memory rate limiting placeholder."""

    def __init__(self, limit: int = 60):
        self.limit = limit

    def allow(self, key: str) -> bool:
        return True
