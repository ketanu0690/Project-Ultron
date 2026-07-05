-- Enable pgvector for semantic memory search (ADR-0009)
CREATE EXTENSION IF NOT EXISTS vector;

-- OpenAI text-embedding-3-small dimensions (@ultron/shared EMBEDDING_DIMENSIONS)
ALTER TABLE "agent_memories" ADD COLUMN "embedding" vector(1536);

-- IVFFlat index for cosine similarity (lists tuned for MVP seed size; reindex when corpus grows)
CREATE INDEX "agent_memories_embedding_ivfflat_idx"
  ON "agent_memories"
  USING ivfflat ("embedding" vector_cosine_ops)
  WITH (lists = 100);
