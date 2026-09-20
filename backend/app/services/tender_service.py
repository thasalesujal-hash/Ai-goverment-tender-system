"""
TenderService — real async CRUD layer backed by PostgreSQL via SQLAlchemy.

Responsibilities:
  - create_tender: Insert a new Tender row, with duplicate detection
  - list_tenders: Query tenders with optional filters + pagination
  - get_tender: Retrieve a single Tender by primary key
"""
import logging
from typing import Optional, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tender import Tender
from app.schemas.tender import TenderCreate

logger = logging.getLogger(__name__)

# Expected tables in the database (used by diagnostics)
EXPECTED_TABLES = [
    "users", "companies", "tenders", "tender_documents", "tender_chunks",
    "tender_metadata", "tender_summaries", "eligibility_reports",
    "notifications", "chat_history", "bid_documents", "audit_logs", "api_keys",
]


class TenderService:
    """Async service for Tender CRUD operations."""

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------
    async def create_tender(
        self,
        db: AsyncSession,
        payload: TenderCreate,
    ) -> Tender:
        """
        Insert a new Tender into the database.

        Deduplication strategy:
          If a Tender with the same (tender_reference, source_name) already
          exists, return the existing record instead of creating a duplicate.
        """
        source_name = payload.source_name or "unknown"

        # Deduplication check
        existing = await self._find_by_reference(
            db, payload.tender_reference, source_name
        )
        if existing:
            logger.info(
                "Skipping duplicate tender: ref=%s source=%s",
                payload.tender_reference,
                source_name,
            )
            return existing

        tender = Tender(**payload.model_dump())
        db.add(tender)
        await db.commit()
        await db.refresh(tender)
        logger.info(
            "Created tender id=%s ref=%s", tender.id, tender.tender_reference
        )
        return tender

    # ------------------------------------------------------------------
    # List
    # ------------------------------------------------------------------
    async def list_tenders(
        self,
        db: AsyncSession,
        *,
        department: Optional[str] = None,
        location: Optional[str] = None,
        status: Optional[str] = None,
        source_name: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[int, List[Tender]]:
        """
        Return (total_count, [Tender, ...]) with optional filters.

        Filters are AND-combined. All filters are case-insensitive partial
        matches (ILIKE) except status/source which are exact matches.
        """
        base_q = select(Tender)
        count_q = select(func.count()).select_from(Tender)

        if department:
            base_q = base_q.where(Tender.department.ilike(f"%{department}%"))
            count_q = count_q.where(Tender.department.ilike(f"%{department}%"))
        if location:
            base_q = base_q.where(Tender.location.ilike(f"%{location}%"))
            count_q = count_q.where(Tender.location.ilike(f"%{location}%"))
        if status:
            base_q = base_q.where(Tender.status == status)
            count_q = count_q.where(Tender.status == status)
        if source_name:
            base_q = base_q.where(Tender.source_name == source_name)
            count_q = count_q.where(Tender.source_name == source_name)

        total_result = await db.execute(count_q)
        total = total_result.scalar_one()

        base_q = (
            base_q
            .order_by(Tender.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(base_q)
        items = list(result.scalars().all())

        return total, items

    # ------------------------------------------------------------------
    # Get single
    # ------------------------------------------------------------------
    async def get_tender(
        self,
        db: AsyncSession,
        tender_id: int,
    ) -> Optional[Tender]:
        """
        Return a Tender by primary key, or None if not found.
        """
        result = await db.execute(
            select(Tender).where(Tender.id == tender_id)
        )
        return result.scalar_one_or_none()

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------
    async def _find_by_reference(
        self,
        db: AsyncSession,
        tender_reference: str,
        source_name: str,
    ) -> Optional[Tender]:
        result = await db.execute(
            select(Tender).where(
                Tender.tender_reference == tender_reference,
                Tender.source_name == source_name,
            )
        )
        return result.scalar_one_or_none()


# Module-level singleton — import this in routers and tasks
tender_service = TenderService()
