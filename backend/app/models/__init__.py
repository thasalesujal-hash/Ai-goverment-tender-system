"""
Model registry — imports ALL models so that Alembic's autogenerate
can discover every table through Base.metadata.

IMPORTANT: Every new model MUST be added here.
"""
from app.database.base import Base  # noqa: F401 — Base must be first

# Core models
from app.models.user import User  # noqa: F401
from app.models.company import Company  # noqa: F401
from app.models.tender import Tender  # noqa: F401

# Document & NLP models (depend on Tender)
from app.models.tender_document import TenderDocument  # noqa: F401
from app.models.tender_chunk import TenderChunk  # noqa: F401
from app.models.tender_metadata import TenderMetadata  # noqa: F401
from app.models.tender_summary import TenderSummary  # noqa: F401

# Report & interaction models (depend on Tender / User)
from app.models.eligibility_report import EligibilityReport  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.chat_history import ChatHistory  # noqa: F401
from app.models.bid_document import BidDocument  # noqa: F401

# Audit & security models
from app.models.audit_log import AuditLog  # noqa: F401
from app.models.api_key import APIKey  # noqa: F401

__all__ = [
    "Base",
    "User",
    "Company",
    "Tender",
    "TenderDocument",
    "TenderChunk",
    "TenderMetadata",
    "TenderSummary",
    "EligibilityReport",
    "Notification",
    "ChatHistory",
    "BidDocument",
    "AuditLog",
    "APIKey",
]
