from typing import List, Dict, Any
from app.crawler.base import BaseTenderCrawler

class ExampleCrawler(BaseTenderCrawler):
    """
    A template for specific portal crawlers.
    Implement this using Playwright or Scrapy.
    """

    def __init__(self):
        super().__init__()
        self.source_name = "Example Portal"

    async def crawl(self) -> List[Dict[str, Any]]:
        # Dummy implementation
        print(f"Crawling {self.source_name}...")
        return [
            {
                "tender_id": "TEND-001",
                "title": "Example Road Construction",
                "description": "Construction of new highway.",
                "published_date": "2026-08-01",
                "closing_date": "2026-09-01",
                "document_urls": ["http://example.com/doc1.pdf"]
            }
        ]
