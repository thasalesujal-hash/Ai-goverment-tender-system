"""
Tests: Database layer — Base, model imports, metadata tables.

These tests verify the fundamental database foundation is correct
and that Alembic will see all expected tables.
"""
import pytest

EXPECTED_TABLES = {
    "users",
    "companies",
    "tenders",
    "tender_documents",
    "tender_chunks",
    "tender_metadata",
    "tender_summaries",
    "eligibility_reports",
    "notifications",
    "chat_history",
    "bid_documents",
    "audit_logs",
    "api_keys",
}


def test_base_import():
    """database/base.py must export a valid DeclarativeBase class."""
    from app.database.base import Base
    from sqlalchemy.orm import DeclarativeBase
    assert issubclass(Base, DeclarativeBase), (
        "Base must be a subclass of sqlalchemy.orm.DeclarativeBase"
    )


def test_all_models_importable():
    """All 12 models must be importable without error."""
    from app.models.user import User
    from app.models.company import Company
    from app.models.tender import Tender
    from app.models.tender_document import TenderDocument
    from app.models.tender_chunk import TenderChunk
    from app.models.tender_metadata import TenderMetadata
    from app.models.tender_summary import TenderSummary
    from app.models.eligibility_report import EligibilityReport
    from app.models.notification import Notification
    from app.models.chat_history import ChatHistory
    from app.models.bid_document import BidDocument
    from app.models.audit_log import AuditLog
    from app.models.api_key import APIKey

    for cls in [
        User, Company, Tender, TenderDocument, TenderChunk, TenderMetadata,
        TenderSummary, EligibilityReport, Notification, ChatHistory,
        BidDocument, AuditLog, APIKey,
    ]:
        assert cls is not None, f"Model {cls} is None"


def test_models_package_exports_all():
    """models/__init__.py must export all 12 models plus Base."""
    import app.models as m
    expected_names = [
        "Base", "User", "Company", "Tender",
        "TenderDocument", "TenderChunk", "TenderMetadata", "TenderSummary",
        "EligibilityReport", "Notification", "ChatHistory",
        "BidDocument", "AuditLog", "APIKey",
    ]
    for name in expected_names:
        assert hasattr(m, name), f"models/__init__.py is missing: {name}"


def test_metadata_contains_all_tables():
    """Base.metadata must contain all 13 expected table names."""
    from app.database.base import Base
    import app.models  # noqa — ensure models are registered

    registered = set(Base.metadata.tables.keys())
    missing = EXPECTED_TABLES - registered
    assert not missing, (
        f"These tables are NOT in Base.metadata (Alembic will miss them): {missing}\n"
        f"Registered: {registered}"
    )


def test_single_base_class():
    """All models must share the SAME Base instance (same metadata object)."""
    from app.database.base import Base as db_base
    from app.models.base import Base as models_base
    from app.models.user import User
    from app.models.tender import Tender
    from app.models.tender_document import TenderDocument

    assert db_base is models_base, (
        "database.base.Base and models.base.Base are different objects — "
        "duplicate Base detected!"
    )
    assert User.__table__.metadata is db_base.metadata
    assert Tender.__table__.metadata is db_base.metadata
    assert TenderDocument.__table__.metadata is db_base.metadata


@pytest.mark.asyncio
async def test_tables_creatable_in_sqlite(db_session):
    """All tables must be creatable in SQLite (basic schema validity check)."""
    # The db_session fixture already creates all tables — if we reach here
    # without an error, the schemas are valid.
    from sqlalchemy import text
    result = await db_session.execute(text("SELECT 1"))
    assert result.scalar() == 1
