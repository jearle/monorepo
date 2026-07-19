import { pipeline } from '@huggingface/transformers';

import {
  EMBEDDINGS_PIPELINE_INITIALIZATION_FAILED_ERROR_PREFIX,
  createUnknownEmbeddingsErrorMessage,
} from './errors';
import {
  type CreateTextEmbeddingPipelineErrorResult,
  type CreateTextEmbeddingPipelineResult,
  type CreateTextEmbeddingPipelineSuccessResult,
  type TextEmbeddingPipeline,
  HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR,
  HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS,
} from './types';

const textEmbeddingPipelinePromiseByModel = new Map<
  string,
  Promise<CreateTextEmbeddingPipelineResult>
>();

type CreateAndCacheTextEmbeddingPipelinePromiseProps = {
  readonly model: string;
};

const createAndCacheTextEmbeddingPipelinePromise = (
  props: CreateAndCacheTextEmbeddingPipelinePromiseProps,
) => {
  const { model } = props;
  const textEmbeddingPipelinePromise = createUncachedTextEmbeddingPipeline({
    model,
  });
  textEmbeddingPipelinePromiseByModel.set(model, textEmbeddingPipelinePromise);
  const result = textEmbeddingPipelinePromise;

  return result;
};

type ReadTextEmbeddingPipelinePromiseProps = {
  readonly model: string;
};

const readTextEmbeddingPipelinePromise = (
  props: ReadTextEmbeddingPipelinePromiseProps,
) => {
  const { model } = props;
  const cachedTextEmbeddingPipelinePromise =
    textEmbeddingPipelinePromiseByModel.get(model);
  const result = cachedTextEmbeddingPipelinePromise ?? null;

  return result;
};

type DeleteTextEmbeddingPipelinePromiseProps = {
  readonly model: string;
};

const deleteTextEmbeddingPipelinePromise = (
  props: DeleteTextEmbeddingPipelinePromiseProps,
) => {
  const { model } = props;
  textEmbeddingPipelinePromiseByModel.delete(model);
};

type CreateUncachedTextEmbeddingPipelineProps = {
  readonly model: string;
};

const createUncachedTextEmbeddingPipeline = async (
  props: CreateUncachedTextEmbeddingPipelineProps,
) => {
  const { model } = props;

  try {
    const textEmbeddingPipeline: TextEmbeddingPipeline = await pipeline(
      `feature-extraction`,
      model,
    );
    const result: CreateTextEmbeddingPipelineSuccessResult = {
      status: HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS,
      data: {
        textEmbeddingPipeline,
      },
    };

    return result;
  } catch (error: unknown) {
    const errorMessage = createUnknownEmbeddingsErrorMessage({
      error,
      prefix: EMBEDDINGS_PIPELINE_INITIALIZATION_FAILED_ERROR_PREFIX,
    });
    const result: CreateTextEmbeddingPipelineErrorResult = {
      status: HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR,
      error: errorMessage,
    };

    return result;
  }
};
export type CreateTextEmbeddingPipelineProps = {
  readonly model: string;
};

export const createTextEmbeddingPipeline = async (
  props: CreateTextEmbeddingPipelineProps,
): Promise<CreateTextEmbeddingPipelineResult> => {
  const { model } = props;

  const cachedTextEmbeddingPipelinePromise = readTextEmbeddingPipelinePromise({
    model,
  });
  const textEmbeddingPipelinePromise =
    cachedTextEmbeddingPipelinePromise ??
    createAndCacheTextEmbeddingPipelinePromise({
      model,
    });
  const result = await textEmbeddingPipelinePromise;
  const hasError =
    result.status === HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR;

  if (hasError) {
    deleteTextEmbeddingPipelinePromise({
      model,
    });
  }

  return result;
};
