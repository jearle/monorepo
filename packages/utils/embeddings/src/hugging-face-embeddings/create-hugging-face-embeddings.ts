import { type Tensor } from '@huggingface/transformers';

import { EMBEDDING_PIPELINE_OPTIONS } from './constants';
import { createTextEmbeddingPipeline } from './create-text-embedding-pipeline';
import {
  EMBEDDINGS_EXECUTION_FAILED_ERROR_PREFIX,
  NO_TEXTS_PROVIDED_ERROR,
  createErrorResult,
  createInvalidEmbeddingsOutputErrorMessage,
  createUnknownEmbeddingsErrorMessage,
} from './errors';
import { postprocessEmbeddingVectors } from './postprocess-embedding-vectors';
import { prepareTextsForEmbedding } from './prepare-texts-for-embedding';
import {
  type EmbedSuccessResult,
  type EmbeddingVector,
  type Embeddings,
  type TextEmbeddingPipeline,
  HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR,
  HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS,
} from './types';

export type EmbedProps = {
  readonly texts: readonly string[];
};

type CreateSuccessResultProps = {
  readonly vectors: readonly EmbeddingVector[];
};

const createSuccessResult = (props: CreateSuccessResultProps) => {
  const { vectors } = props;
  const result: EmbedSuccessResult = {
    status: HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS,
    data: {
      vectors,
    },
  };

  return result;
};

const getIsNumber = (value: unknown): value is number => {
  const isNumberValue = typeof value === `number`;
  const isFiniteNumber = Number.isFinite(value);
  const result = isNumberValue && isFiniteNumber;

  return result;
};

const getIsEmbeddingVector = (value: unknown): value is EmbeddingVector => {
  if (Array.isArray(value) === false || value.length === 0) {
    return false;
  }

  const isEmbeddingVector = value.every((item) => {
    const result = getIsNumber(item);

    return result;
  });
  const result = isEmbeddingVector;

  return result;
};

const getIsEmbeddingVectorCollection = (
  value: unknown,
  textCount: number,
): value is readonly EmbeddingVector[] => {
  if (Array.isArray(value) === false || value.length !== textCount) {
    return false;
  }

  const isEmbeddingVectorCollection = value.every((item) => {
    const result = getIsEmbeddingVector(item);

    return result;
  });
  const result = isEmbeddingVectorCollection;

  return result;
};

type NormalizePipelineOutputProps = {
  readonly output: Tensor;
  readonly textCount: number;
};

const normalizePipelineOutput = (props: NormalizePipelineOutputProps) => {
  const { output, textCount } = props;
  const outputValue = output.tolist();
  const isSingleVector = textCount === 1 && getIsEmbeddingVector(outputValue);

  if (isSingleVector) {
    const vectors = [outputValue];
    const result = createSuccessResult({ vectors });

    return result;
  }

  const isEmbeddingVectorCollection = getIsEmbeddingVectorCollection(
    outputValue,
    textCount,
  );

  if (isEmbeddingVectorCollection === false) {
    const error = createInvalidEmbeddingsOutputErrorMessage({
      output: outputValue,
      textCount,
    });
    const result = createErrorResult({ error });

    return result;
  }

  const vectors = outputValue;
  const result = createSuccessResult({ vectors });

  return result;
};

type EmbedTextsProps = {
  readonly model: string;
  readonly textEmbeddingPipeline: TextEmbeddingPipeline;
  readonly texts: readonly string[];
};

const embedTexts = async (props: EmbedTextsProps) => {
  const { model, textEmbeddingPipeline, texts } = props;
  const preparedTexts = prepareTextsForEmbedding({
    model,
    texts,
  });
  const pipelineTexts = [...preparedTexts];

  try {
    const output = await textEmbeddingPipeline(
      pipelineTexts,
      EMBEDDING_PIPELINE_OPTIONS,
    );
    const normalizedOutput = normalizePipelineOutput({
      output,
      textCount: texts.length,
    });

    if (
      normalizedOutput.status === HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR
    ) {
      const result = normalizedOutput;

      return result;
    }

    const vectors = postprocessEmbeddingVectors({
      model,
      vectors: normalizedOutput.data.vectors,
    });
    const result = createSuccessResult({
      vectors,
    });

    return result;
  } catch (error: unknown) {
    const errorMessage = createUnknownEmbeddingsErrorMessage({
      error,
      prefix: EMBEDDINGS_EXECUTION_FAILED_ERROR_PREFIX,
    });
    const result = createErrorResult({
      error: errorMessage,
    });

    return result;
  }
};

export type CreateHuggingFaceEmbeddingsProps = {
  readonly model: string;
};

/**
 * Creates a local Hugging Face embeddings adapter with a `texts -> vectors` contract.
 *
 * @param props - The local embeddings configuration.
 * @returns An embeddings adapter that returns either an ordered vector list or a structured error.
 *
 * @example
 * const { embeddings } = createHuggingFaceEmbeddings({
 *   model: DEFAULT_HUGGING_FACE_EMBEDDING_MODEL,
 * });
 *
 * const { error, vectors } = await embeddings.embed({
 *   texts: [`hello world`],
 * });
 */
export const createHuggingFaceEmbeddings = (
  props: CreateHuggingFaceEmbeddingsProps,
) => {
  const { model } = props;

  const embed = async (props: EmbedProps) => {
    const { texts } = props;
    const hasNoTexts = texts.length === 0;

    if (hasNoTexts) {
      const result = createErrorResult({
        error: NO_TEXTS_PROVIDED_ERROR,
      });

      return result;
    }

    const textEmbeddingPipelineResult = await createTextEmbeddingPipeline({
      model,
    });

    if (
      textEmbeddingPipelineResult.status ===
      HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR
    ) {
      const result = createErrorResult({
        error: textEmbeddingPipelineResult.error,
      });

      return result;
    }

    const result = await embedTexts({
      model,
      textEmbeddingPipeline:
        textEmbeddingPipelineResult.data.textEmbeddingPipeline,
      texts,
    });

    return result;
  };

  const embeddings: Embeddings = { embed };
  const result = { embeddings };

  return result;
};
