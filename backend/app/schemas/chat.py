from pydantic import BaseModel


class ChatRequest(BaseModel):
    tender_id: int | None = None
    message: str


class ChatResponse(BaseModel):
    answer: str
