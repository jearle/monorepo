import {
  type EmbedErrorResult,
  HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR,
} from './types';

export const EMBEDDINGS_EXECUTION_FAILED_ERROR_PREFIX = `hugging face embeddings execution failed`;
export const EMBEDDINGS_PIPELINE_INITIALIZATION_FAILED_ERROR_PREFIX = `hugging face embeddings pipeline initialization failed`;
export const INVALID_EMBEDDINGS_OUTPUT_ERROR = `hugging face embeddings output is invalid`;
export const NO_TEXTS_PROVIDED_ERROR = `no texts provided`;
export const UNKNOWN_EMBEDDINGS_ERROR = `unknown embeddings error`;

export type CreateUnknownEmbeddingsErrorMessageProps = {
  readonly error: unknown;
  readonly prefix: string;
};

export const createUnknownEmbeddingsErrorMessage = (
  props: CreateUnknownEmbeddingsErrorMessageProps,
) => {
  const { error, prefix } = props;
  const isError = error instanceof Error;

  if (isError) {
    const errorMessage = error.message;
    const result = `${prefix}: ${errorMessage}`;

    return result;
  }

  const isString = typeof error === `string`;

  if (isString) {
    const errorMessage = error;
    const result = `${prefix}: ${errorMessage}`;

    return result;
  }

  const errorMessage = UNKNOWN_EMBEDDINGS_ERROR;
  const result = `${prefix}: ${errorMessage}`;

  return result;
};

export type CreateErrorResultProps = {
  readonly error: string;
};

export const createErrorResult = (props: CreateErrorResultProps) => {
  const { error } = props;
  const result: EmbedErrorResult = {
    status: HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR,
    error,
  };

  return result;
};

export type CreateInvalidEmbeddingsOutputErrorMessageProps = {
  readonly output: unknown;
  readonly textCount: number;
};

export const createInvalidEmbeddingsOutputErrorMessage = (
  props: CreateInvalidEmbeddingsOutputErrorMessageProps,
) => {
  const { output, textCount } = props;
  const isArrayValue = Array.isArray(output);
  const outputType = isArrayValue ? `array` : typeof output;
  const outputCount = isArrayValue ? output.length : `unknown`;
  const errorMessage = `${INVALID_EMBEDDINGS_OUTPUT_ERROR}: expected ${textCount} non-empty numeric vectors, received ${outputType} with count ${outputCount}`;
  const result = errorMessage;

  return result;
};
