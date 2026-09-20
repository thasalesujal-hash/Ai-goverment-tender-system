# Deployment Guide

## Local Development

- Start PostgreSQL, Redis, Qdrant, and MinIO with Docker Compose.
- Copy backend/.env.example to backend/.env and customize the values.
- Run the backend with uvicorn app.main:app.
- Run the frontend with npm install and npm run dev.

## Production

- Provision managed PostgreSQL, Redis, object storage, and a vector database.
- Apply environment variables with secrets management.
- Deploy through Docker Compose or Kubernetes.
