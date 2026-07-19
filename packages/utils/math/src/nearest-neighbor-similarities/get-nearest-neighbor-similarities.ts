import { getSimilarityMatrixValidationError } from '../cosine-similarity-matrix';
import { INSUFFICIENT_SIMILARITY_MATRIX_ROWS_ERROR } from '../errors';
import { type SimilarityMatrix } from '../types';

import { type GetNearestNeighborSimilaritiesResult } from './types';

type GetGreatestSimilarityProps = {
  readonly row: readonly number[];
  readonly rowIndex: number;
};

const getGreatestSimilarity = (props: GetGreatestSimilarityProps) => {
  const { row, rowIndex } = props;
  const greatestSimilarity = row.reduce(
    (currentGreatestSimilarity, similarity, columnIndex) => {
      const isSelfComparison = columnIndex === rowIndex;

      if (isSelfComparison) {
        return currentGreatestSimilarity;
      }

      const isGreaterSimilarity = similarity > currentGreatestSimilarity;
      const nextGreatestSimilarity = isGreaterSimilarity
        ? similarity
        : currentGreatestSimilarity;

      return nextGreatestSimilarity;
    },
    Number.NEGATIVE_INFINITY,
  );

  return greatestSimilarity;
};

export type GetNearestNeighborSimilaritiesProps = {
  readonly similarityMatrix: SimilarityMatrix;
};

/**
 * Projects a similarity matrix into per-row nearest-neighbor similarities.
 *
 * Self-comparison values are always excluded. An empty matrix returns an empty
 * collection, and a single-row matrix returns an `Error` because no distinct
 * neighbor exists for that row.
 *
 * @param props - The similarity matrix to project
 * @returns A structured result containing either nearest-neighbor values or an error
 *
 * @example
 * const result = getNearestNeighborSimilarities({
 *   similarityMatrix: [
 *     [1, 0.2],
 *     [0.2, 1],
 *   ],
 * });
 */
export const getNearestNeighborSimilarities = (
  props: GetNearestNeighborSimilaritiesProps,
) => {
  const { similarityMatrix } = props;
  const matrixRowCount = similarityMatrix.length;
  const hasNoRows = matrixRowCount === 0;

  if (hasNoRows) {
    const result: GetNearestNeighborSimilaritiesResult = {
      status: MATH_RESULT_STATUS_SUCCESS,
      data: {
        nearestNeighborSimilarities: [],
      },
    };

    return result;
  }

  const similarityMatrixValidationError = getSimilarityMatrixValidationError({
    similarityMatrix,
  });

  if (similarityMatrixValidationError !== null) {
    const result: GetNearestNeighborSimilaritiesResult = {
      status: MATH_RESULT_STATUS_ERROR,
      error: similarityMatrixValidationError,
    };

    return result;
  }

  const hasSingleRow = matrixRowCount === 1;

  if (hasSingleRow) {
    const result: GetNearestNeighborSimilaritiesResult = {
      status: MATH_RESULT_STATUS_ERROR,
      error: new Error(INSUFFICIENT_SIMILARITY_MATRIX_ROWS_ERROR),
    };

    return result;
  }

  const nearestNeighborSimilarities = similarityMatrix.map((row, rowIndex) => {
    const greatestSimilarity = getGreatestSimilarity({
      row,
      rowIndex,
    });

    return greatestSimilarity;
  });
  const result: GetNearestNeighborSimilaritiesResult = {
    status: MATH_RESULT_STATUS_SUCCESS,
    data: {
      nearestNeighborSimilarities,
    },
  };

  return result;
};
import {
  MATH_RESULT_STATUS_ERROR,
  MATH_RESULT_STATUS_SUCCESS,
} from '../constants';
