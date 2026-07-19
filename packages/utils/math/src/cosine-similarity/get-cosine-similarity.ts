import {
  MATH_RESULT_STATUS_ERROR,
  MATH_RESULT_STATUS_SUCCESS,
} from '../constants';
import {
  NON_FINITE_COSINE_SIMILARITY_ERROR,
  createMismatchedVectorLengthErrorMessage,
} from '../errors';
import { getVectorValidationError } from '../vector';
import { type Vector } from '../types';

import { getCosineSimilarityValue } from './get-cosine-similarity-value';
import { type GetCosineSimilarityResult } from './types';

export type GetCosineSimilarityProps = {
  readonly vector1: Vector;
  readonly vector2: Vector;
};

/**
 * Computes raw cosine similarity for two numeric vectors.
 *
 * Returns the mathematical cosine similarity when the input is valid. The
 * helper never throws, and instead returns a structured error for empty
 * vectors, mismatched vector lengths, zero-magnitude vectors, or non-finite
 * numeric values.
 *
 * @param props - The vectors to compare
 * @returns A structured result containing either `data.similarity` or `error`
 *
 * @example
 * const { error, similarity } = getCosineSimilarity({
 *   vector1: [1, 0, 0],
 *   vector2: [0, 1, 0],
 * });
 */
export const getCosineSimilarity = (props: GetCosineSimilarityProps) => {
  const { vector1, vector2 } = props;
  const expectedLength = vector1.length;
  const receivedLength = vector2.length;
  const hasMismatchedLength = expectedLength !== receivedLength;

  if (hasMismatchedLength) {
    const errorMessage = createMismatchedVectorLengthErrorMessage({
      expectedLength,
      receivedLength,
      vectorName: `vector2`,
    });
    const result: GetCosineSimilarityResult = {
      status: MATH_RESULT_STATUS_ERROR,
      error: new Error(errorMessage),
    };

    return result;
  }

  const vector1ValidationError = getVectorValidationError({
    requireNonZeroMagnitude: true,
    vector: vector1,
    vectorName: `vector1`,
  });

  if (vector1ValidationError !== null) {
    const result: GetCosineSimilarityResult = {
      status: MATH_RESULT_STATUS_ERROR,
      error: vector1ValidationError,
    };

    return result;
  }

  const vector2ValidationError = getVectorValidationError({
    requireNonZeroMagnitude: true,
    vector: vector2,
    vectorName: `vector2`,
  });

  if (vector2ValidationError !== null) {
    const result: GetCosineSimilarityResult = {
      status: MATH_RESULT_STATUS_ERROR,
      error: vector2ValidationError,
    };

    return result;
  }

  const similarity = getCosineSimilarityValue({
    vector1,
    vector2,
  });
  const isFiniteSimilarity = Number.isFinite(similarity);

  if (isFiniteSimilarity === false) {
    const result: GetCosineSimilarityResult = {
      status: MATH_RESULT_STATUS_ERROR,
      error: new Error(NON_FINITE_COSINE_SIMILARITY_ERROR),
    };

    return result;
  }

  const result: GetCosineSimilarityResult = {
    status: MATH_RESULT_STATUS_SUCCESS,
    data: {
      similarity,
    },
  };

  return result;
};
