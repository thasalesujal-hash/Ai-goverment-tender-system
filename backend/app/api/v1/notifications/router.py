from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from app.scheduler.tasks import send_manual_reminder, send_deadline_reminders, auto_crawl_all_portals

router = APIRouter()


class ReminderRequest(BaseModel):
    user_id: str
    message: str
    email: Optional[str] = None


class DeadlineAlertRequest(BaseModel):
    tender_id: str
    tender_title: str
    closing_date: str
    days_remaining: int
    recipients: List[Dict[str, str]]  # [{"user_id": "...", "email": "..."}]


@router.get("/")
async def list_notifications() -> Dict[str, Any]:
    """List all notification channels and scheduled jobs."""
    return {
        "channels": ["email", "in_app"],
        "scheduled_jobs": [
            {
                "name": "daily-deadline-reminders",
                "schedule": "Every day at 08:00 AM IST",
                "task": "scheduler.send_deadline_reminders",
            },
            {
                "name": "auto-crawl-portals",
                "schedule": "Every 6 hours",
                "task": "scheduler.auto_crawl_all_portals",
            },
        ],
    }


@router.post("/reminder")
async def send_reminder(req: ReminderRequest) -> Dict[str, Any]:
    """
    Manually send a one-off reminder to a user.
    Dispatched as an async Celery task.
    """
    if not req.user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required.")
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message is required.")

    task = send_manual_reminder.delay(
        user_id=req.user_id,
        message=req.message,
        email=req.email or "",
    )

    return {
        "status": "queued",
        "task_id": str(task.id) if hasattr(task, "id") else "N/A",
        "user_id": req.user_id,
        "message": req.message,
    }


@router.post("/trigger-reminders")
async def trigger_reminders() -> Dict[str, Any]:
    """
    Manually trigger the deadline reminder sweep (normally runs daily via Celery Beat).
    Useful for testing without waiting for the schedule.
    """
    task = send_deadline_reminders.delay()
    return {
        "status": "queued",
        "task_id": str(task.id) if hasattr(task, "id") else "N/A",
        "message": "Deadline reminder sweep triggered. Check Celery worker logs.",
    }


@router.post("/trigger-crawl")
async def trigger_auto_crawl() -> Dict[str, Any]:
    """
    Manually trigger auto-crawl of all registered government portals.
    Normally runs every 6 hours via Celery Beat.
    """
    task = auto_crawl_all_portals.delay()
    return {
        "status": "queued",
        "task_id": str(task.id) if hasattr(task, "id") else "N/A",
        "message": "Auto-crawl for all portals triggered. Check Celery worker logs.",
    }
