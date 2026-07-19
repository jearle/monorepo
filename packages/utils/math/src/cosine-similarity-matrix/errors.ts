import {
  createNonFiniteSimilarityMatrixValueErrorMessage,
  createNonSquareSimilarityMatrixErrorMessage,
} from '../errors';
import { type SimilarityMatrix } from '../types';

export type GetSimilarityMatrixValidationErrorProps = {
  readonly similarityMatrix: SimilarityMatrix;
};

export const getSimilarityMatrixValidationError = (
  props: GetSimilarityMatrixValidationErrorProps,
) => {
  const { similarityMatrix } = props;
  const expectedLength = similarityMatrix.length;
  const indexedRows = similarityMatrix.entries();

  for (const [rowIndex, row] of indexedRows) {
    const receivedLength = row.length;
    const hasMismatchedLength = receivedLength !== expectedLength;

    if (hasMismatchedLength) {
      const error = createNonSquareSimilarityMatrixErrorMessage({
        expectedLength,
        receivedLength,
        rowIndex,
      });
      const result = new Error(error);

      return result;
    }

    const indexedValues = row.entries();

    for (const [columnIndex, value] of indexedValues) {
      const isFiniteValue = Number.isFinite(value);

      if (isFiniteValue === false) {
        const errorMessage = createNonFiniteSimilarityMatrixValueErrorMessage({
          columnIndex,
          rowIndex,
        });
        const result = new Error(errorMessage);

        return result;
      }
    }
  }

  const result = null;

  return result;
};
