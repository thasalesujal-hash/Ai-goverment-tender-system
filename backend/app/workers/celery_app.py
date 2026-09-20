from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

celery_app = Celery(
    "tender_assistant",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.workers.tasks",
        "app.scheduler.tasks",
    ]
)

celery_app.conf.task_serializer = "json"
celery_app.conf.result_serializer = "json"
celery_app.conf.accept_content = ["json"]
celery_app.conf.timezone = "Asia/Kolkata"
celery_app.conf.enable_utc = True

# ─── Celery Beat Periodic Schedule ──────────────────────────────────────────
celery_app.conf.beat_schedule = {
    # Send deadline reminders every day at 8:00 AM IST
    "daily-deadline-reminders": {
        "task": "scheduler.send_deadline_reminders",
        "schedule": crontab(hour=2, minute=30),  # 08:00 IST = 02:30 UTC
        "options": {"queue": "reminders"},
    },
    # Auto-crawl all government portals every 6 hours
    "auto-crawl-portals": {
        "task": "scheduler.auto_crawl_all_portals",
        "schedule": crontab(minute=0, hour="*/6"),
        "options": {"queue": "crawlers"},
    },
}
