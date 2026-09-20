from typing import Dict, Type, List, Optional
from app.crawler.base import BaseTenderCrawler
from app.crawler.implementations.gem_crawler import GemCrawler
from app.crawler.implementations.eprocurement_india_crawler import EProcurementIndiaCrawler
from app.crawler.implementations.sam_gov_crawler import SamGovCrawler
from app.crawler.implementations.example_crawler import ExampleCrawler

class CrawlerRegistry:
    """Registry mapping portal identifiers to tender crawler instances."""

    _crawlers: Dict[str, Type[BaseTenderCrawler]] = {
        "gem": GemCrawler,
        "eprocurement_india": EProcurementIndiaCrawler,
        "sam_gov": SamGovCrawler,
        "example": ExampleCrawler,
    }

    @classmethod
    def get_crawler(cls, portal_key: str) -> Optional[BaseTenderCrawler]:
        """Instantiate and return crawler for the given portal key."""
        crawler_cls = cls._crawlers.get(portal_key.lower().strip())
        if crawler_cls:
            return crawler_cls()
        return None

    @classmethod
    def list_portals(cls) -> List[str]:
        """Return list of supported portal keys."""
        return list(cls._crawlers.keys())
