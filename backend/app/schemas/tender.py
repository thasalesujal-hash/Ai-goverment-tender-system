from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TenderCreate(BaseModel):
    """Schema for creating a new tender record."""
    tender_reference: str
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    published_date: Optional[datetime] = None
    submission_deadline: Optional[datetime] = None
    estimated_value: Optional[Decimal] = None
    emd_amount: Optional[Decimal] = None
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    status: str = "active"
    description: Optional[str] = None


class TenderRead(BaseModel):
    """Schema for reading a tender record from the database."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    tender_reference: str
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    published_date: Optional[datetime] = None
    submission_deadline: Optional[datetime] = None
    estimated_value: Optional[Decimal] = None
    emd_amount: Optional[Decimal] = None
    source_url: Optional[str] = None
    source_name: Optional[str] = None
    status: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class TenderListResponse(BaseModel):
    """Paginated list of tenders."""
    total: int
    items: list[TenderRead]
