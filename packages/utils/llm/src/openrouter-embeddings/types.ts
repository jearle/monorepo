export const OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS = `SUCCESS` as const;
export const OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR = `ERROR` as const;
export const OPENROUTER_EMBEDDINGS_RESULT_STATUSES = [
  OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS,
  OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR,
] as const;

export type EmbeddingVector = readonly number[];

export type OpenrouterEmbeddingsData = {
  readonly vectors: readonly EmbeddingVector[];
};

export type OpenrouterEmbeddingsResultFailure = {
  readonly status: typeof OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR;
  readonly error: string;
};

export type OpenrouterEmbeddingsResultSuccess = {
  readonly status: typeof OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS;
  readonly data: OpenrouterEmbeddingsData;
};

export type OpenrouterEmbeddingsResult =
  | OpenrouterEmbeddingsResultFailure
  | OpenrouterEmbeddingsResultSuccess;
