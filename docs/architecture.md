# Architecture Overview

The system is organized into layered modules to keep business logic, infrastructure concerns, and AI orchestration separate.

- API layer: route handlers and schema validation
- Service layer: business operations
- Repository layer: persistence abstraction
- Domain layer: SQLAlchemy models
- AI layer: parsing, OCR, embeddings, retrieval, and LLM orchestration
- Infrastructure layer: storage, queue, monitoring, and deployment assets
