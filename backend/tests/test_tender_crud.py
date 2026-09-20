"""
Tests: Tender CRUD operations via TenderService.

Uses the in-memory SQLite session from conftest.py.

Note: SQLite does not support ILIKE — tests that would use ILIKE
use exact-match filters instead, which still validates the query logic.
"""
import pytest
from decimal import Decimal
from datetime import datetime, timezone

from app.services.tender_service import TenderService
from app.schemas.tender import TenderCreate

# Use a fresh service instance for each test module
service = TenderService()


def _make_payload(
    ref: str = "TEND-001",
    title: str = "Test Tender",
    source_name: str = "example",
    department: str = "Public Works",
    location: str = "Delhi",
    status: str = "active",
    **kwargs,
) -> TenderCreate:
    return TenderCreate(
        tender_reference=ref,
        title=title,
        source_name=source_name,
        department=department,
        location=location,
        status=status,
        estimated_value=Decimal("500000.00"),
        **kwargs,
    )


# ---------------------------------------------------------------------------
# Create
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_create_tender(db_session):
    """TenderService.create_tender must persist a row to the database."""
    payload = _make_payload()
    tender = await service.create_tender(db_session, payload)

    assert tender.id is not None
    assert tender.id > 0
    assert tender.tender_reference == "TEND-001"
    assert tender.title == "Test Tender"
    assert tender.source_name == "example"
    assert tender.status == "active"
    assert tender.created_at is not None
    assert tender.updated_at is not None


@pytest.mark.asyncio
async def test_create_tender_sets_department_and_location(db_session):
    payload = _make_payload(ref="TEND-002", department="Railways", location="Mumbai")
    tender = await service.create_tender(db_session, payload)
    assert tender.department == "Railways"
    assert tender.location == "Mumbai"


@pytest.mark.asyncio
async def test_create_tender_deduplication(db_session):
    """
    Creating the same (tender_reference, source_name) twice must return
    the SAME database row, not create a duplicate.
    """
    payload = _make_payload(ref="TEND-DUP", source_name="gem")
    first = await service.create_tender(db_session, payload)
    second = await service.create_tender(db_session, payload)

    assert first.id == second.id, (
        f"Expected same ID for duplicate, got {first.id} vs {second.id}"
    )

    # Verify only one row exists
    total, items = await service.list_tenders(db_session)
    refs = [t.tender_reference for t in items]
    assert refs.count("TEND-DUP") == 1


@pytest.mark.asyncio
async def test_create_tender_different_source_not_duplicate(db_session):
    """
    Same tender_reference but different source_name → two separate rows.
    """
    payload_a = _make_payload(ref="TEND-X", source_name="gem")
    payload_b = _make_payload(ref="TEND-X", source_name="eprocurement_india")
    a = await service.create_tender(db_session, payload_a)
    b = await service.create_tender(db_session, payload_b)
    assert a.id != b.id


# ---------------------------------------------------------------------------
# List
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_list_tenders_returns_all(db_session):
    """list_tenders must return all inserted rows."""
    for i in range(3):
        await service.create_tender(db_session, _make_payload(ref=f"TEND-L{i}"))

    total, items = await service.list_tenders(db_session)
    assert total == 3
    assert len(items) == 3


@pytest.mark.asyncio
async def test_list_tenders_filter_by_status(db_session):
    """Filtering by status must exclude non-matching rows."""
    await service.create_tender(db_session, _make_payload(ref="ACTIVE-1", status="active"))
    await service.create_tender(db_session, _make_payload(ref="CLOSED-1", status="closed"))

    total, items = await service.list_tenders(db_session, status="active")
    assert total == 1
    assert items[0].status == "active"


@pytest.mark.asyncio
async def test_list_tenders_filter_by_source(db_session):
    """Filtering by source_name (exact match) must work correctly."""
    await service.create_tender(db_session, _make_payload(ref="GEM-1", source_name="gem"))
    await service.create_tender(db_session, _make_payload(ref="SAM-1", source_name="sam_gov"))

    total, items = await service.list_tenders(db_session, source_name="gem")
    assert total == 1
    assert items[0].source_name == "gem"


@pytest.mark.asyncio
async def test_list_tenders_pagination(db_session):
    """Pagination (skip + limit) must work correctly."""
    for i in range(5):
        await service.create_tender(db_session, _make_payload(ref=f"PAGE-{i}"))

    total, page1 = await service.list_tenders(db_session, skip=0, limit=3)
    total2, page2 = await service.list_tenders(db_session, skip=3, limit=3)

    assert total == 5
    assert total2 == 5
    assert len(page1) == 3
    assert len(page2) == 2

    page1_ids = {t.id for t in page1}
    page2_ids = {t.id for t in page2}
    assert page1_ids.isdisjoint(page2_ids), "Pages must not overlap"


@pytest.mark.asyncio
async def test_list_tenders_empty(db_session):
    """list_tenders on empty database must return (0, [])."""
    total, items = await service.list_tenders(db_session)
    assert total == 0
    assert items == []


# ---------------------------------------------------------------------------
# Get single
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_get_tender_existing(db_session):
    """get_tender must return the correct row by primary key."""
    created = await service.create_tender(db_session, _make_payload(ref="TEND-GET-1"))
    fetched = await service.get_tender(db_session, created.id)

    assert fetched is not None
    assert fetched.id == created.id
    assert fetched.tender_reference == "TEND-GET-1"


@pytest.mark.asyncio
async def test_get_tender_not_found(db_session):
    """get_tender must return None for a non-existent ID."""
    result = await service.get_tender(db_session, tender_id=999999)
    assert result is None


# ---------------------------------------------------------------------------
# Schema serialization
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_tender_read_from_orm(db_session):
    """TenderRead must serialize a SQLAlchemy ORM object without error."""
    from app.schemas.tender import TenderRead

    created = await service.create_tender(db_session, _make_payload(ref="TEND-SER-1"))
    read = TenderRead.model_validate(created)

    assert read.id == created.id
    assert read.title == created.title
    assert read.status == "active"
