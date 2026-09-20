# Folder Documentation

- backend/app/api: modular REST endpoints grouped by domain.
- backend/app/core: common configuration, security, and exception handling.
- backend/app/models: SQLAlchemy entities for the database layer.
- backend/app/schemas: Pydantic validation schemas.
- backend/app/services: application service layer.
- backend/app/repositories: persistence abstractions using the repository pattern.
- backend/app/crawler, parser, ocr, preprocessing, chunking, embeddings, vectorstore, retrieval, reranker, llm, agents, workflows: AI and orchestration modules.
- frontend: React UI shell.
- docker: runtime wiring and ingress.
