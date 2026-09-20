"""
Tests: Crawler normalization and crawler → database persistence.

These tests verify:
  1. normalize_raw_tender() correctly maps raw dict fields to TenderCreate
  2. The full crawler → normalize → DB pipeline works end-to-end
"""
import pytest
from decimal import Decimal
from datetime import datetime, timezone

from app.crawler.normalizer import normalize_raw_tender
from app.schemas.tender import TenderCreate


# ---------------------------------------------------------------------------
# Raw tender fixture (matches ExampleCrawler / GemCrawler output format)
# ---------------------------------------------------------------------------

RAW_TENDER = {
    "tender_id": "GEM-2026-001",
    "title": "Supply of Office Furniture",
    "description": "Supply and installation of ergonomic office furniture",
    "organization": "Ministry of Finance",
    "location": "New Delhi",
    "published_date": "2026-08-01",
    "closing_date": "2026-09-15",
    "estimated_value": "250000",
    "source_url": "https://gem.gov.in/tender/GEM-2026-001",
    "document_urls": ["https://gem.gov.in/doc/tender1.pdf"],
    "category": "Furniture",
}

RAW_TENDER_MINIMAL = {
    "tender_id": "MIN-001",
    "title": "Minimal Tender",
}


# ---------------------------------------------------------------------------
# Normalization tests
# ---------------------------------------------------------------------------

def test_normalize_required_fields():
    """normalize_raw_tender must set tender_reference and title."""
    result = normalize_raw_tender(RAW_TENDER, source_name="gem")

    assert isinstance(result, TenderCreate)
    assert result.tender_reference == "GEM-2026-001"
    assert result.title == "Supply of Office Furniture"
    assert result.source_name == "gem"


def test_normalize_department_from_organization():
    """organization field maps to department."""
    result = normalize_raw_tender(RAW_TENDER, source_name="gem")
    assert result.department == "Ministry of Finance"


def test_normalize_location():
    """location field is preserved."""
    result = normalize_raw_tender(RAW_TENDER, source_name="gem")
    assert result.location == "New Delhi"


def test_normalize_dates():
    """Date strings must be parsed into timezone-aware datetime objects."""
    result = normalize_raw_tender(RAW_TENDER, source_name="gem")

    assert result.published_date is not None
    assert isinstance(result.published_date, datetime)
    assert result.published_date.year == 2026
    assert result.published_date.month == 8
    assert result.published_date.day == 1

    assert result.submission_deadline is not None
    assert isinstance(result.submission_deadline, datetime)
    assert result.submission_deadline.month == 9
    assert result.submission_deadline.day == 15


def test_normalize_estimated_value():
    """estimated_value string must be parsed to Decimal."""
    result = normalize_raw_tender(RAW_TENDER, source_name="gem")
    assert result.estimated_value == Decimal("250000")


def test_normalize_source_name_always_wins():
    """The source_name parameter must override any 'source' in the raw dict."""
    raw_with_source = dict(RAW_TENDER, source="some-other-source")
    result = normalize_raw_tender(raw_with_source, source_name="gem")
    assert result.source_name == "gem"


def test_normalize_source_url_from_document_urls():
    """If source_url is absent, first document_url is used."""
    raw = {
        "tender_id": "T-URL-1",
        "title": "URL Fallback Test",
        "document_urls": ["https://example.com/doc.pdf"],
    }
    result = normalize_raw_tender(raw, source_name="example")
    assert result.source_url == "https://example.com/doc.pdf"


def test_normalize_description_includes_category():
    """category field must be appended to description."""
    result = normalize_raw_tender(RAW_TENDER, source_name="gem")
    assert "Category: Furniture" in result.description


def test_normalize_minimal_dict():
    """A minimal raw dict (only tender_id + title) must normalize without error."""
    result = normalize_raw_tender(RAW_TENDER_MINIMAL, source_name="example")
    assert result.tender_reference == "MIN-001"
    assert result.title == "Minimal Tender"
    assert result.department is None
    assert result.published_date is None


def test_normalize_missing_tender_id():
    """If tender_id is absent, normalizer uses 'UNKNOWN' as reference."""
    raw = {"title": "No ID Tender"}
    result = normalize_raw_tender(raw, source_name="example")
    assert result.tender_reference == "UNKNOWN"


def test_normalize_invalid_date_is_none():
    """An invalid date string must produce None rather than crash."""
    raw = dict(RAW_TENDER_MINIMAL, published_date="not-a-date")
    result = normalize_raw_tender(raw, source_name="example")
    assert result.published_date is None


def test_normalize_invalid_value_is_none():
    """A non-numeric value string must produce None rather than crash."""
    raw = dict(RAW_TENDER_MINIMAL, estimated_value="TBD")
    result = normalize_raw_tender(raw, source_name="example")
    assert result.estimated_value is None


def test_normalize_title_truncated():
    """Title longer than 500 chars must be truncated to 500."""
    raw = {"tender_id": "LONG-1", "title": "X" * 600}
    result = normalize_raw_tender(raw, source_name="example")
    assert len(result.title) == 500


# ---------------------------------------------------------------------------
# Crawler → DB persistence integration test
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_crawler_normalization_then_db_persistence(db_session):
    """
    End-to-end: Simulate crawler output → normalize → persist to DB.
    Verifies the full pipeline works without Celery (direct call).
    """
    from app.services.tender_service import TenderService

    service = TenderService()

    # Simulate what ExampleCrawler.crawl() returns
    raw_tenders = [
        {
            "tender_id": "TEND-001",
            "title": "Example Road Construction",
            "description": "Construction of new highway.",
            "published_date": "2026-08-01",
            "closing_date": "2026-09-01",
            "document_urls": ["http://example.com/doc1.pdf"],
        },
        {
            "tender_id": "TEND-002",
            "title": "Example Bridge Repair",
            "description": "Repair and maintenance of bridge.",
            "published_date": "2026-08-05",
            "closing_date": "2026-09-10",
            "estimated_value": "1500000",
        },
    ]

    saved = []
    for raw in raw_tenders:
        payload = normalize_raw_tender(raw, source_name="example")
        tender = await service.create_tender(db_session, payload)
        saved.append(tender)

    # Verify both rows are in the database
    assert len(saved) == 2
    for t in saved:
        assert t.id is not None

    total, items = await service.list_tenders(db_session)
    assert total == 2

    titles = {t.title for t in items}
    assert "Example Road Construction" in titles
    assert "Example Bridge Repair" in titles


@pytest.mark.asyncio
async def test_crawler_pipeline_deduplication(db_session):
    """
    Running the same crawler output twice must NOT create duplicate rows.
    """
    from app.services.tender_service import TenderService

    service = TenderService()

    raw = [{"tender_id": "DUP-001", "title": "Duplicate Test"}]

    # First run
    for r in raw:
        payload = normalize_raw_tender(r, source_name="example")
        await service.create_tender(db_session, payload)

    # Second run (identical data)
    for r in raw:
        payload = normalize_raw_tender(r, source_name="example")
        await service.create_tender(db_session, payload)

    total, items = await service.list_tenders(db_session)
    assert total == 1, f"Expected 1 row after dedup, got {total}"
