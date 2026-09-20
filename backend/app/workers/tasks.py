import asyncio
import logging
import httpx
from app.workers.celery_app import celery_app
from app.storage.s3_storage import S3Storage

logger = logging.getLogger(__name__)


def run_async(coro):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)


@celery_app.task(name="tasks.crawl_portal_tenders")
def crawl_portal_tenders(portal_key: str):
    """
    Execute tender crawler for a given portal key (gem, eprocurement_india, sam_gov).

    Flow:
      1. Crawl the portal (returns raw tender dicts — may be demo/fallback data)
      2. Normalize each raw dict → TenderCreate schema
      3. Persist each TenderCreate to PostgreSQL via TenderService
      4. Dispatch document download tasks for any returned document_urls
    """
    logger.info("Triggered crawler task for portal: %s", portal_key)

    async def _crawl():
        from app.crawler.registry import CrawlerRegistry
        from app.crawler.normalizer import normalize_raw_tender
        from app.database.session import AsyncSessionLocal
        from app.services.tender_service import tender_service

        crawler = CrawlerRegistry.get_crawler(portal_key)
        if not crawler:
            logger.error("No crawler registered for portal key '%s'", portal_key)
            return {"status": "error", "message": f"Unsupported portal '{portal_key}'"}

        # ── Step 1: Crawl ──────────────────────────────────────────────
        # NOTE: crawler implementations may return demo/fallback data
        # during development. This is intentional for testing the pipeline.
        raw_tenders = await crawler.crawl()
        logger.info(
            "Crawled %d raw tenders from %s (source may be demo/fallback data)",
            len(raw_tenders),
            crawler.source_name,
        )

        # ── Step 2 + 3: Normalize → Persist ───────────────────────────
        saved_count = 0
        skipped_count = 0

        async with AsyncSessionLocal() as db:
            for raw in raw_tenders:
                try:
                    payload = normalize_raw_tender(raw, source_name=crawler.source_name)
                    tender = await tender_service.create_tender(db, payload)
                    if tender.id:
                        saved_count += 1
                    else:
                        skipped_count += 1
                except Exception as exc:
                    logger.warning(
                        "Failed to persist tender from %s: %s — %s",
                        crawler.source_name,
                        raw.get("tender_id", "?"),
                        exc,
                    )

        logger.info(
            "Portal %s: %d saved, %d skipped (duplicates/errors)",
            portal_key,
            saved_count,
            skipped_count,
        )

        # ── Step 4: Dispatch document download tasks ───────────────────
        for tender in raw_tenders:
            tender_id = tender.get("tender_id")
            doc_urls = tender.get("document_urls", [])
            for url in doc_urls:
                download_tender_document.delay(tender_id=tender_id, url=url)

        return {
            "status": "success",
            "portal": portal_key,
            "crawled": len(raw_tenders),
            "saved": saved_count,
            "skipped": skipped_count,
        }

    return run_async(_crawl())


@celery_app.task(name="tasks.download_tender_document")
def download_tender_document(tender_id: str, url: str):
    """Download PDF and upload to S3."""
    logger.info("Downloading tender doc for %s from %s", tender_id, url)

    async def _download():
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()

            s3 = S3Storage()
            key = f"tenders/{tender_id}/doc.pdf"
            await s3.upload(response.content, key, content_type="application/pdf")
            logger.info("Successfully uploaded %s to S3", key)
            return key

    return run_async(_download())


@celery_app.task(name="tasks.index_tender_document")
def index_tender_document(tender_id: str, text: str):
    """Chunk, embed, and index tender text into Qdrant."""
    logger.info("Indexing tender %s into vector store...", tender_id)

    async def _index():
        from app.chunking.chunker import Chunker
        from app.embeddings.embedding_service import EmbeddingService
        from app.vectorstore.qdrant_client import QdrantService

        chunker = Chunker(chunk_size=1000, chunk_overlap=150)
        chunks = chunker.chunk(text, metadata={"tender_id": tender_id})

        if not chunks:
            logger.warning("No chunks generated for tender %s", tender_id)
            return 0

        embedder = EmbeddingService()
        texts = [c["text"] for c in chunks]
        embeddings = await embedder.embed_texts(texts)

        qdrant = QdrantService()
        point_ids = await qdrant.upsert_chunks(chunks, embeddings)
        logger.info("Successfully indexed %d chunks for tender %s", len(point_ids), tender_id)
        return len(point_ids)

    return run_async(_index())


@celery_app.task(name="tasks.process_tender_document")
def process_tender_document(tender_id: str, s3_key: str):
    """Extract text from downloaded PDF and trigger vector indexing."""
    logger.info("Processing tender doc %s", s3_key)

    async def _process():
        from app.ocr.extractor import DocumentExtractor

        s3 = S3Storage()
        content = await s3.download(s3_key)

        extractor = DocumentExtractor()
        text = await extractor.extract_text(content)

        logger.info("Extracted %d characters from %s", len(text), s3_key)

        # Trigger vector indexing
        index_tender_document(tender_id=tender_id, text=text)
        return len(text)

    return run_async(_process())
