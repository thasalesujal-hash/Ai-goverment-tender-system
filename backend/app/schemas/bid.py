from pydantic import BaseModel


class BidGenerationRequest(BaseModel):
    tender_id: int
    company_id: int | None = None


class BidGenerationResponse(BaseModel):
    document_id: int
    title: str
    content: str
