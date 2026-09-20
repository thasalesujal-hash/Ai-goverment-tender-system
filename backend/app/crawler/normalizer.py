"""
Crawler output normalizer.

Converts raw crawler dictionaries into validated TenderCreate schemas
that can be safely persisted to PostgreSQL.

IMPORTANT: This module deals with DEMO / FALLBACK data from crawler
implementations. It does NOT claim to represent real live government
tender data unless the crawler explicitly fetches from a live source.
The normalization layer is clearly separated from live collection.
"""
import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from app.schemas.tender import TenderCreate

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# Date parsing helpers
# ─────────────────────────────────────────────────────────────────────────────

_DATE_FORMATS = [
    "%Y-%m-%d",
    "%d/%m/%Y",
    "%d-%m-%Y",
    "%Y-%m-%dT%H:%M:%S",
    "%Y-%m-%dT%H:%M:%SZ",
    "%Y-%m-%dT%H:%M:%S%z",
]


def _parse_date(value: Any) -> Optional[datetime]:
    """Try to parse a date string into a timezone-aware datetime."""
    if value is None:
        return None
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value
    raw = str(value).strip()
    for fmt in _DATE_FORMATS:
        try:
            dt = datetime.strptime(raw, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except ValueError:
            continue
    logger.warning("Could not parse date value: %r", value)
    return None


# ─────────────────────────────────────────────────────────────────────────────
# Value parsing helpers
# ─────────────────────────────────────────────────────────────────────────────

def _parse_value(value: Any) -> Optional[float]:
    """Parse a numeric value from various representations."""
    if value is None:
        return None
    try:
        return float(str(value).replace(",", "").strip())
    except (ValueError, TypeError):
        return None


# ─────────────────────────────────────────────────────────────────────────────
# Main normalization function
# ─────────────────────────────────────────────────────────────────────────────

def normalize_raw_tender(raw: Dict[str, Any], source_name: str) -> TenderCreate:
    """
    Normalize a raw crawler output dict into a TenderCreate schema.

    Expected raw dict keys (all optional except tender_id + title):
      tender_id        → tender_reference
      title            → title
      description      → description
      organization     → department
      location         → location
      published_date   → published_date
      closing_date     → submission_deadline
      estimated_value  → estimated_value
      source           → source_name (overridden by source_name param)
      document_urls    → ignored at this layer (handled by S3/download task)
      category         → appended to description if present

    The source_name parameter always wins over any raw["source"] field.
    """
    raw_title = raw.get("title") or raw.get("name") or "Untitled Tender"
    tender_reference = str(raw.get("tender_id") or raw.get("id") or "UNKNOWN")

    description_parts = []
    if raw.get("description"):
        description_parts.append(str(raw["description"]))
    if raw.get("category"):
        description_parts.append(f"Category: {raw['category']}")

    return TenderCreate(
        tender_reference=tender_reference,
        title=str(raw_title)[:500],
        department=raw.get("organization") or raw.get("department"),
        location=raw.get("location"),
        published_date=_parse_date(raw.get("published_date")),
        submission_deadline=_parse_date(raw.get("closing_date") or raw.get("deadline")),
        estimated_value=_parse_value(raw.get("estimated_value")),
        emd_amount=_parse_value(raw.get("emd_amount")),
        source_url=raw.get("source_url") or (
            raw.get("document_urls", [None])[0]
            if raw.get("document_urls") else None
        ),
        source_name=source_name,
        status=raw.get("status") or "active",
        description=" | ".join(description_parts) if description_parts else None,
    )
