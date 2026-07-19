import { type FeatureExtractionPipeline } from '@huggingface/transformers';

import {
  type EMBEDDING_PIPELINE_OPTIONS,
  type HUGGING_FACE_EMBEDDING_MODELS,
} from './constants';

export const HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS = `SUCCESS` as const;
export const HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR = `ERROR` as const;
export const HUGGING_FACE_EMBEDDINGS_RESULT_STATUSES = [
  HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS,
  HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR,
] as const;

export type EmbeddingVector = readonly number[];

export type EmbeddingPipelineOptions = typeof EMBEDDING_PIPELINE_OPTIONS;

export type HuggingFaceEmbeddingModel =
  (typeof HUGGING_FACE_EMBEDDING_MODELS)[keyof typeof HUGGING_FACE_EMBEDDING_MODELS];

export type TextEmbeddingPipeline = FeatureExtractionPipeline;

export type CreateTextEmbeddingPipelineData = {
  readonly textEmbeddingPipeline: TextEmbeddingPipeline;
};

export type EmbeddingsData = {
  readonly vectors: readonly EmbeddingVector[];
};

export type CreateTextEmbeddingPipelineErrorResult = {
  readonly status: typeof HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR;
  readonly error: string;
};

export type CreateTextEmbeddingPipelineSuccessResult = {
  readonly status: typeof HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS;
  readonly data: CreateTextEmbeddingPipelineData;
};

export type CreateTextEmbeddingPipelineResult =
  | CreateTextEmbeddingPipelineErrorResult
  | CreateTextEmbeddingPipelineSuccessResult;
export type EmbeddingsProps = { readonly texts: readonly string[] };

export type EmbeddingsEmbed = {
  readonly status: typeof HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR;
  readonly error: string;
};

export type EmbeddingsEmbed2 = {
  readonly status: typeof HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS;
  readonly data: EmbeddingsData;
};

/**
 * Shared embeddings adapter contract.
 *
 * @example
 * const { error, vectors } = await embeddings.embed({
 *   texts: [`hello world`],
 * });
 */
export type Embeddings = {
  readonly embed: (
    props: EmbeddingsProps,
  ) => Promise<EmbeddingsEmbed | EmbeddingsEmbed2>;
};

export type HuggingFaceEmbeddings = Embeddings;

export type EmbedErrorResult = {
  readonly status: typeof HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR;
  readonly error: string;
};

export type EmbedSuccessResult = {
  readonly status: typeof HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS;
  readonly data: EmbeddingsData;
};

export type EmbedResult = EmbedErrorResult | EmbedSuccessResult;
