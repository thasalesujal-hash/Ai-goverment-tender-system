import pytest
from app.crawler.registry import CrawlerRegistry
from app.crawler.implementations.gem_crawler import GemCrawler
from app.crawler.implementations.eprocurement_india_crawler import EProcurementIndiaCrawler
from app.crawler.implementations.sam_gov_crawler import SamGovCrawler

def test_crawler_registry():
    portals = CrawlerRegistry.list_portals()
    assert "gem" in portals
    assert "eprocurement_india" in portals
    assert "sam_gov" in portals
    
    gem_instance = CrawlerRegistry.get_crawler("gem")
    assert isinstance(gem_instance, GemCrawler)

@pytest.mark.asyncio
async def test_gem_crawler():
    crawler = GemCrawler()
    tenders = await crawler.crawl()
    assert len(tenders) > 0
    first = tenders[0]
    assert "tender_id" in first
    assert "title" in first
    assert "document_urls" in first

@pytest.mark.asyncio
async def test_eprocurement_india_crawler():
    crawler = EProcurementIndiaCrawler()
    tenders = await crawler.crawl()
    assert len(tenders) > 0
    first = tenders[0]
    assert "2026_CPPP" in first["tender_id"]

@pytest.mark.asyncio
async def test_sam_gov_crawler():
    crawler = SamGovCrawler()
    tenders = await crawler.crawl()
    assert len(tenders) > 0
    first = tenders[0]
    assert "FA8771" in first["tender_id"] or "W912DR" in first["tender_id"]
