import pytest
from app.services.notification_service import NotificationService


@pytest.mark.asyncio
async def test_send_reminder_no_email():
    """Reminder without email should return in-app channel only."""
    svc = NotificationService()
    result = await svc.send_reminder(
        user_id="usr-001",
        message="Tender GEM/2026/B/5891204 closes in 3 days!",
    )
    assert result["status"] == "queued"
    assert "in_app" in result["channels"]


@pytest.mark.asyncio
async def test_send_deadline_alert_no_smtp():
    """Deadline alert with no SMTP configured should log gracefully."""
    svc = NotificationService()
    results = await svc.send_deadline_alert(
        tender_id="GEM/2026/B/5891204",
        tender_title="Supply of Server Hardware",
        closing_date="2026-08-20",
        days_remaining=3,
        recipients=[{"user_id": "usr-001", "email": "test@example.com"}],
    )
    assert len(results) == 1
    assert results[0]["user_id"] == "usr-001"


def test_email_html_template():
    """Email HTML template should include the message."""
    svc = NotificationService()
    html = svc._reminder_email_html("Your tender closes in 2 days!")
    assert "Your tender closes in 2 days!" in html
    assert "AI Tender Assistant" in html
