import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Multi-channel notification service.
    Supports: Email (SMTP) and In-App (logged/stored) channels.
    """

    def __init__(self):
        self.smtp_host = getattr(settings, "smtp_host", "smtp.gmail.com")
        self.smtp_port = getattr(settings, "smtp_port", 587)
        self.smtp_user = getattr(settings, "smtp_user", "")
        self.smtp_password = getattr(settings, "smtp_password", "")
        self.from_email = getattr(settings, "from_email", "noreply@aitender.com")

    # ─── Email ───────────────────────────────────────────────────────────────

    async def send_email(
        self,
        to_email: str,
        subject: str,
        body_html: str,
    ) -> Dict[str, Any]:
        """Send an HTML email via SMTP. Falls back to log if SMTP is unconfigured."""
        if not self.smtp_user or not self.smtp_password:
            logger.warning(
                f"[EMAIL NOT SENT — SMTP unconfigured] To: {to_email} | Subject: {subject}"
            )
            return {"status": "logged", "channel": "email", "to": to_email, "subject": subject}

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.from_email
            msg["To"] = to_email
            msg.attach(MIMEText(body_html, "html"))

            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.from_email, [to_email], msg.as_string())

            logger.info(f"Email sent to {to_email}: {subject}")
            return {"status": "sent", "channel": "email", "to": to_email, "subject": subject}

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return {"status": "failed", "channel": "email", "error": str(e)}

    # ─── Reminders ───────────────────────────────────────────────────────────

    async def send_reminder(
        self,
        user_id: str,
        message: str,
        email: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Send a tender deadline reminder to a user."""
        logger.info(f"Reminder for user {user_id}: {message}")

        result = {
            "user_id": user_id,
            "message": message,
            "status": "queued",
            "channels": ["in_app"],
        }

        if email:
            email_result = await self.send_email(
                to_email=email,
                subject="⏰ Tender Deadline Reminder — AI Tender Assistant",
                body_html=self._reminder_email_html(message),
            )
            result["email_result"] = email_result
            result["channels"].append("email")

        return result

    async def send_deadline_alert(
        self,
        tender_id: str,
        tender_title: str,
        closing_date: str,
        days_remaining: int,
        recipients: List[Dict[str, str]],  # [{"user_id": ..., "email": ...}]
    ) -> List[Dict[str, Any]]:
        """Broadcast a closing deadline alert to all subscribed users."""
        results = []
        for recipient in recipients:
            message = (
                f"Tender '{tender_title}' (ID: {tender_id}) closes on {closing_date}. "
                f"Only {days_remaining} day(s) remaining!"
            )
            result = await self.send_reminder(
                user_id=recipient.get("user_id", "unknown"),
                message=message,
                email=recipient.get("email"),
            )
            results.append(result)
        return results

    # ─── Templates ───────────────────────────────────────────────────────────

    def _reminder_email_html(self, message: str) -> str:
        return f"""
        <html><body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
          <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color:#1a73e8;">⏰ Tender Deadline Reminder</h2>
            <p style="font-size:16px;color:#333;">{message}</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="font-size:13px;color:#888;">
              This is an automated reminder from <strong>AI Tender Assistant</strong>.<br>
              Log in to review the tender and take action before the deadline.
            </p>
          </div>
        </body></html>
        """
