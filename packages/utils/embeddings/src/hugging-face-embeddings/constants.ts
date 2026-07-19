export const EMBEDDING_PIPELINE_OPTIONS = {
  normalize: true,
  pooling: `mean`,
} as const;

export const HUGGING_FACE_EMBEDDING_MODELS = {
  allMiniLmL6V2: `Xenova/all-MiniLM-L6-v2`,
  nomicEmbedTextV15: `nomic-ai/nomic-embed-text-v1.5`,
} as const;

export const DEFAULT_HUGGING_FACE_EMBEDDING_MODEL =
  HUGGING_FACE_EMBEDDING_MODELS.nomicEmbedTextV15;
