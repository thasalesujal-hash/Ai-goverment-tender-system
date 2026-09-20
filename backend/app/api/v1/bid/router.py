from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from app.services.bid_service import BidService
from app.services.eligibility_service import EligibilityService

router = APIRouter()
bid_service = BidService()
eligibility_service = EligibilityService()


class BidRequest(BaseModel):
    tender_id: str
    company_profile: Optional[Dict[str, Any]] = None
    additional_context: Optional[str] = None


class EligibilityRequest(BaseModel):
    tender_id: str
    company_profile: Optional[Dict[str, Any]] = None


@router.post("/generate")
async def generate_bid(req: BidRequest) -> Dict[str, Any]:
    """Generate a full bid document for the specified tender."""
    if not req.tender_id.strip():
        raise HTTPException(status_code=400, detail="tender_id is required.")
    return await bid_service.generate(
        tender_id=req.tender_id,
        company_profile=req.company_profile,
        additional_context=req.additional_context,
    )


@router.post("/eligibility")
async def check_eligibility(req: EligibilityRequest) -> Dict[str, Any]:
    """Assess company eligibility for a given tender."""
    if not req.tender_id.strip():
        raise HTTPException(status_code=400, detail="tender_id is required.")
    return await eligibility_service.assess(
        tender_id=req.tender_id,
        company_profile=req.company_profile,
    )
