from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseTenderCrawler(ABC):
    """Abstract base class for government tender crawlers."""

    def __init__(self):
        self.source_name = "Unknown"

    @abstractmethod
    async def crawl(self) -> List[Dict[str, Any]]:
        """
        Crawl the portal and return a list of extracted tender dictionaries.
        Each dictionary should contain at least:
        - tender_id
        - title
        - description
        - published_date
        - closing_date
        - document_urls (list of strings)
        """
        pass
