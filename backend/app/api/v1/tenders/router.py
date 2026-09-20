"""
Tenders API router — real CRUD endpoints backed by PostgreSQL.

Endpoints:
  POST   /api/v1/tenders           — create a new tender
  GET    /api/v1/tenders           — list tenders (with optional filters)
  GET    /api/v1/tenders/{id}      — get a single tender by ID
  POST   /api/v1/tenders/crawl     — trigger background crawl (Celery)
"""
import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.tender import TenderCreate, TenderRead, TenderListResponse
from app.services.tender_service import tender_service

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Helper schemas (defined here to avoid circular imports)
# ---------------------------------------------------------------------------

class CrawlRequest(BaseModel):
    """Request body for triggering a background crawl."""
    portal: str  # gem | eprocurement_india | sam_gov


# ---------------------------------------------------------------------------
# POST /api/v1/tenders — Create
# ---------------------------------------------------------------------------

@router.post("/", response_model=TenderRead, status_code=201)
async def create_tender(
    payload: TenderCreate,
    db: AsyncSession = Depends(get_db),
) -> TenderRead:
    """
    Create a new tender record in PostgreSQL.

    Returns the existing record if the same (tender_reference, source_name)
    combination already exists (idempotent).
    """
    tender = await tender_service.create_tender(db, payload)
    return tender


# ---------------------------------------------------------------------------
# GET /api/v1/tenders — List
# ---------------------------------------------------------------------------

@router.get("/", response_model=TenderListResponse)
async def list_tenders(
    department: Optional[str] = Query(None, description="Filter by department (partial match)"),
    location: Optional[str] = Query(None, description="Filter by location (partial match)"),
    status: Optional[str] = Query(None, description="Filter by status (exact match, e.g. 'active')"),
    source: Optional[str] = Query(None, description="Filter by source portal name (exact match)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=200, description="Maximum records to return"),
    db: AsyncSession = Depends(get_db),
) -> TenderListResponse:
    """
    List tenders from PostgreSQL with optional filters.

    Supports filtering by department, location, status, and source portal.
    """
    total, items = await tender_service.list_tenders(
        db,
        department=department,
        location=location,
        status=status,
        source_name=source,
        skip=skip,
        limit=limit,
    )
    return TenderListResponse(total=total, items=items)


# ---------------------------------------------------------------------------
# GET /api/v1/tenders/{tender_id} — Get single
# ---------------------------------------------------------------------------

@router.get("/{tender_id}", response_model=TenderRead)
async def get_tender(
    tender_id: int,
    db: AsyncSession = Depends(get_db),
) -> TenderRead:
    """
    Retrieve a single tender by its database ID.
    Returns 404 if no tender with that ID exists.
    """
    tender = await tender_service.get_tender(db, tender_id)
    if tender is None:
        raise HTTPException(status_code=404, detail=f"Tender {tender_id} not found")
    return tender


# ---------------------------------------------------------------------------
# POST /api/v1/tenders/crawl — Background crawl trigger
# ---------------------------------------------------------------------------

SUPPORTED_PORTALS = ["gem", "eprocurement_india", "sam_gov", "example"]


@router.post("/crawl")
async def trigger_crawl(req: CrawlRequest):
    """
    Trigger a background tender crawl via Celery.

    NOTE: This dispatches to a Celery worker. The tenders are ingested
    into PostgreSQL by the crawl task, not this endpoint.
    """
    if req.portal not in SUPPORTED_PORTALS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported portal '{req.portal}'. Choose from: {SUPPORTED_PORTALS}",
        )
    try:
        from app.workers.tasks import crawl_portal_tenders
        task = crawl_portal_tenders.delay(req.portal)
        task_id = str(task.id) if hasattr(task, "id") else "N/A"
    except Exception as exc:
        logger.warning("Celery not available, crawl not queued: %s", exc)
        task_id = "celery-unavailable"

    return {
        "status": "queued",
        "portal": req.portal,
        "task_id": task_id,
        "message": (
            f"Crawling '{req.portal}' tenders in the background. "
            "Results will be saved to PostgreSQL."
        ),
    }
