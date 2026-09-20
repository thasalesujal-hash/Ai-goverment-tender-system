import asyncio
import logging
from datetime import datetime, date
from typing import List
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)


def run_async(coro):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)


# ─── Reminder Task ────────────────────────────────────────────────────────────

@celery_app.task(name="scheduler.send_deadline_reminders")
def send_deadline_reminders():
    """
    Celery Beat periodic task — runs daily.
    Scans tenders closing within 1, 3, or 7 days and sends reminder notifications.
    """
    logger.info(f"[{datetime.utcnow()}] Running deadline reminder sweep...")

    async def _check():
        from app.services.notification_service import NotificationService
        notification_svc = NotificationService()

        # In production: query DB for tenders closing in 1/3/7 days with subscribed users.
        # For now, we use mock data demonstrating the full flow.
        mock_upcoming_tenders = [
            {
                "tender_id": "GEM/2026/B/5891204",
                "title": "Supply of Server Hardware",
                "closing_date": "2026-08-20",
                "days_remaining": 3,
                "subscribed_users": [
                    {"user_id": "usr-001", "email": ""},
                ],
            },
            {
                "tender_id": "2026_CPPP_789012_1",
                "title": "4-Lane Flyover Construction",
                "closing_date": "2026-08-30",
                "days_remaining": 7,
                "subscribed_users": [
                    {"user_id": "usr-002", "email": ""},
                ],
            },
        ]

        sent_count = 0
        for tender in mock_upcoming_tenders:
            results = await notification_svc.send_deadline_alert(
                tender_id=tender["tender_id"],
                tender_title=tender["title"],
                closing_date=tender["closing_date"],
                days_remaining=tender["days_remaining"],
                recipients=tender["subscribed_users"],
            )
            sent_count += len(results)
            logger.info(
                f"Reminder dispatched for {tender['tender_id']} "
                f"({tender['days_remaining']}d remaining) → {len(results)} user(s)"
            )

        return {"reminders_sent": sent_count, "tenders_checked": len(mock_upcoming_tenders)}

    return run_async(_check())


# ─── Auto-Crawl Task ──────────────────────────────────────────────────────────

@celery_app.task(name="scheduler.auto_crawl_all_portals")
def auto_crawl_all_portals():
    """
    Celery Beat periodic task — runs every 6 hours.
    Triggers portal crawlers for all registered government portals.
    """
    logger.info(f"[{datetime.utcnow()}] Auto-crawl sweep starting...")

    from app.workers.tasks import crawl_portal_tenders
    from app.crawler.registry import CrawlerRegistry

    portals = CrawlerRegistry.list_portals()
    dispatched = []

    for portal in portals:
        if portal == "example":
            continue
        crawl_portal_tenders.delay(portal)
        dispatched.append(portal)
        logger.info(f"Queued crawl task for portal: {portal}")

    return {"portals_queued": dispatched, "count": len(dispatched)}


# ─── Manual One-off Reminder ─────────────────────────────────────────────────

@celery_app.task(name="scheduler.send_manual_reminder")
def send_manual_reminder(user_id: str, message: str, email: str = ""):
    """
    Manually trigger a one-off notification for a user.
    Called from the Notifications API endpoint.
    """
    logger.info(f"Manual reminder for user {user_id}: {message}")

    async def _send():
        from app.services.notification_service import NotificationService
        svc = NotificationService()
        return await svc.send_reminder(
            user_id=user_id,
            message=message,
            email=email or None,
        )

    return run_async(_send())
