from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.services.chat_service import ChatService

router = APIRouter()
chat_service = ChatService()


class ChatRequest(BaseModel):
    question: str
    tender_id: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None
    top_k: int = 5


class SummarizeRequest(BaseModel):
    tender_id: str
    top_k: int = 10


class CompareRequest(BaseModel):
    tender_ids: List[str]


@router.post("/ask")
async def ask_question(req: ChatRequest) -> Dict[str, Any]:
    """Ask a question about government tenders using RAG + LLM."""
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    return await chat_service.ask(
        question=req.question,
        tender_id=req.tender_id,
        history=req.history,
        top_k=req.top_k,
    )


@router.post("/summarize")
async def summarize_tender(req: SummarizeRequest) -> Dict[str, Any]:
    """Generate an executive summary for a specific tender."""
    summary = await chat_service.summarize(
        tender_id=req.tender_id,
        top_k=req.top_k,
    )
    return {"tender_id": req.tender_id, "summary": summary}


@router.post("/compare")
async def compare_tenders(req: CompareRequest) -> Dict[str, Any]:
    """Compare multiple tenders side-by-side."""
    if len(req.tender_ids) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 tender IDs to compare.")
    comparison = await chat_service.compare(tender_ids=req.tender_ids)
    return {"tender_ids": req.tender_ids, "comparison": comparison}
