# AI Tender & Government Bid Assistant

A production-grade, modular platform for collecting, analyzing, and responding to government tenders using FastAPI, React, PostgreSQL, Redis, Celery, and LLM/RAG services.

## Architecture Overview

- Backend: FastAPI + SQLAlchemy + Alembic + Celery + Redis + PostgreSQL
- AI: LangChain, LangGraph, Qdrant, embeddings, RAG pipeline, OCR, summarization, eligibility analysis
- Frontend: React + Tailwind + Axios
- Deployment: Docker Compose + Nginx + GitHub Actions

## Project Structure

- backend/: FastAPI application and AI services
- frontend/: React UI shell
- docker/: Docker and Nginx assets
- docs/: Architecture, API, deployment and ER documents
- scripts/: Automation helpers

## Quick Start

1. Copy backend/.env.example to backend/.env and adjust values.
2. Build and start services with docker compose.
3. Open the API docs at http://localhost:8000/docs.

## Notes

This repository currently provides an architectural scaffold and implementation skeleton for enterprise-grade development.
