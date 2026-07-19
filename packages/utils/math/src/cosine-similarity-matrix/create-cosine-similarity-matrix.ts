import {
  MATH_RESULT_STATUS_ERROR,
  MATH_RESULT_STATUS_SUCCESS,
} from '../constants';
import {
  getDotProduct,
  getVectorCollectionValidationError,
  getVectorMagnitudeState,
} from '../vector';
import { type Vector, type VectorCollection } from '../types';

import { getSimilarityMatrixValidationError } from './errors';
import { type CreateCosineSimilarityMatrixResult } from './types';

type StableVectorState = {
  readonly magnitudeFactor: number;
  readonly scaledVector: Vector;
};

type CreateStableVectorStateProps = {
  readonly vector: Vector;
};

const createStableVectorState = (props: CreateStableVectorStateProps) => {
  const { vector } = props;
  const magnitudeState = getVectorMagnitudeState({ vector });
  const { scale, scaledSquareSum } = magnitudeState;
  const hasNoScale = scale === 0;

  if (hasNoScale) {
    const result: StableVectorState = {
      magnitudeFactor: 0,
      scaledVector: vector,
    };

    return result;
  }

  const scaledVector = vector.map((value) => {
    const scaledValue = value / scale;

    return scaledValue;
  });
  const magnitudeFactor = Math.sqrt(scaledSquareSum);
  const result: StableVectorState = {
    magnitudeFactor,
    scaledVector,
  };

  return result;
};

type GetStableCosineSimilarityValueProps = {
  readonly vectorState1: StableVectorState;
  readonly vectorState2: StableVectorState;
};

const getStableCosineSimilarityValue = (
  props: GetStableCosineSimilarityValueProps,
) => {
  const { vectorState1, vectorState2 } = props;
  const { magnitudeFactor: magnitudeFactor1, scaledVector: scaledVector1 } =
    vectorState1;
  const { magnitudeFactor: magnitudeFactor2, scaledVector: scaledVector2 } =
    vectorState2;
  const dotProductResult = getDotProduct({
    vector1: scaledVector1,
    vector2: scaledVector2,
  });

  if (dotProductResult.status === MATH_RESULT_STATUS_ERROR) {
    return Number.NaN;
  }

  const { dotProduct } = dotProductResult.data;
  const magnitudeProduct = magnitudeFactor1 * magnitudeFactor2;
  const similarity = dotProduct / magnitudeProduct;

  return similarity;
};

type CreateUpperTriangleRowProps = {
  readonly rowIndex: number;
  readonly stableVectorState: StableVectorState;
  readonly stableVectorStates: readonly StableVectorState[];
};

const createUpperTriangleRow = (props: CreateUpperTriangleRowProps) => {
  const { rowIndex, stableVectorState, stableVectorStates } = props;
  const trailingStableVectorStates = stableVectorStates.slice(rowIndex);
  const upperTriangleRow = trailingStableVectorStates.map(
    (comparisonVectorState, trailingColumnIndex) => {
      const columnIndex = rowIndex + trailingColumnIndex;
      const isDiagonal = columnIndex === rowIndex;

      if (isDiagonal) {
        return 1;
      }

      const similarity = getStableCosineSimilarityValue({
        vectorState1: stableVectorState,
        vectorState2: comparisonVectorState,
      });

      return similarity;
    },
  );

  return upperTriangleRow;
};

type GetMirroredUpperTriangleValueProps = {
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly upperTriangleRows: readonly (readonly number[])[];
};

const getMirroredUpperTriangleValue = (
  props: GetMirroredUpperTriangleValueProps,
) => {
  const { columnIndex, rowIndex, upperTriangleRows } = props;
  const isUpperTriangleValue = columnIndex >= rowIndex;

  if (isUpperTriangleValue) {
    const valueIndex = columnIndex - rowIndex;
    const upperTriangleRow = upperTriangleRows[rowIndex];
    const upperTriangleValue = upperTriangleRow?.[valueIndex];
    const result = upperTriangleValue ?? Number.NaN;

    return result;
  }

  const mirroredRow = upperTriangleRows[columnIndex];
  const mirroredValueIndex = rowIndex - columnIndex;
  const mirroredValue = mirroredRow?.[mirroredValueIndex];
  const result = mirroredValue ?? Number.NaN;

  return result;
};

export type CreateCosineSimilarityMatrixProps = {
  readonly vectors: VectorCollection;
};

/**
 * Builds a cosine-similarity matrix from an ordered vector collection.
 *
 * An empty collection returns an empty matrix. The helper never throws, and
 * instead returns a structured error for mismatched vector lengths, empty
 * vectors, zero-magnitude vectors, or non-finite numeric values.
 *
 * @param props - The ordered vectors to compare pairwise
 * @returns A structured result containing either `data.similarityMatrix` or `error`
 *
 * @example
 * const { error, similarityMatrix } = createCosineSimilarityMatrix({
 *   vectors: [
 *     [1, 0],
 *     [0, 1],
 *   ],
 * });
 */
export const createCosineSimilarityMatrix = (
  props: CreateCosineSimilarityMatrixProps,
) => {
  const { vectors } = props;
  const vectorCount = vectors.length;
  const hasNoVectors = vectorCount === 0;

  if (hasNoVectors) {
    const result: CreateCosineSimilarityMatrixResult = {
      status: MATH_RESULT_STATUS_SUCCESS,
      data: {
        similarityMatrix: [],
      },
    };

    return result;
  }

  const vectorCollectionValidationError = getVectorCollectionValidationError({
    vectors,
  });

  if (vectorCollectionValidationError !== null) {
    const result: CreateCosineSimilarityMatrixResult = {
      status: MATH_RESULT_STATUS_ERROR,
      error: vectorCollectionValidationError,
    };

    return result;
  }

  const stableVectorStates = vectors.map((vector) => {
    return createStableVectorState({ vector });
  });
  const upperTriangleRows = stableVectorStates.map(
    (stableVectorState, rowIndex) => {
      const upperTriangleRow = createUpperTriangleRow({
        rowIndex,
        stableVectorState,
        stableVectorStates,
      });

      return upperTriangleRow;
    },
  );
  const similarityMatrix = stableVectorStates.map((_, rowIndex) => {
    const similarityRow = stableVectorStates.map((__, columnIndex) => {
      const similarity = getMirroredUpperTriangleValue({
        columnIndex,
        rowIndex,
        upperTriangleRows,
      });

      return similarity;
    });

    return similarityRow;
  });
  const similarityMatrixValidationError = getSimilarityMatrixValidationError({
    similarityMatrix,
  });

  if (similarityMatrixValidationError !== null) {
    const result: CreateCosineSimilarityMatrixResult = {
      status: MATH_RESULT_STATUS_ERROR,
      error: similarityMatrixValidationError,
    };

    return result;
  }

  const result: CreateCosineSimilarityMatrixResult = {
    status: MATH_RESULT_STATUS_SUCCESS,
    data: {
      similarityMatrix,
    },
  };

  return result;
};
