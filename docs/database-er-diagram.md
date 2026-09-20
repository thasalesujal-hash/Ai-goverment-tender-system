# Database ER Diagram

Entities:
- Users
- Companies
- Tenders
- TenderDocuments
- TenderChunks
- TenderMetadata
- TenderSummaries
- EligibilityReports
- BidDocuments
- ChatHistory
- Notifications
- AuditLogs
- APIKeys

Relationships:
- Users own chat and notifications.
- Companies are associated with bid and tender workflows.
- Tenders contain documents, chunks, metadata, summaries, eligibility reports, and bids.
