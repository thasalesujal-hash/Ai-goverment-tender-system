from typing import Optional
from pydantic import BaseModel


class CompanyCreate(BaseModel):
    user_id: int
    company_name: str
    gst_number: Optional[str] = None
    pan_number: Optional[str] = None
    annual_turnover: Optional[float] = None
    experience_years: Optional[int] = None


class CompanyRead(BaseModel):
    id: int
    user_id: int
    company_name: str
    gst_number: Optional[str] = None
    pan_number: Optional[str] = None
    annual_turnover: Optional[float] = None
    experience_years: Optional[int] = None
