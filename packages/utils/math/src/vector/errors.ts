import {
  createEmptyVectorErrorMessage,
  createMismatchedVectorLengthErrorMessage,
  createNonFiniteVectorValueErrorMessage,
  createZeroMagnitudeVectorErrorMessage,
} from '../errors';
import { type Vector, type VectorCollection } from '../types';

import { getVectorMagnitude } from './get-vector-magnitude';

export type GetVectorValidationErrorProps = {
  readonly requireNonZeroMagnitude: boolean;
  readonly vector: Vector;
  readonly vectorName: string;
};

export const getVectorValidationError = (
  props: GetVectorValidationErrorProps,
) => {
  const { requireNonZeroMagnitude, vector, vectorName } = props;
  const valueCount = vector.length;
  const hasNoValues = valueCount === 0;

  if (hasNoValues) {
    const errorMessage = createEmptyVectorErrorMessage({ vectorName });
    const result = new Error(errorMessage);

    return result;
  }

  const indexedValues = vector.entries();

  for (const [valueIndex, value] of indexedValues) {
    const isFiniteValue = Number.isFinite(value);

    if (isFiniteValue === false) {
      const errorMessage = createNonFiniteVectorValueErrorMessage({
        valueIndex,
        vectorName,
      });
      const result = new Error(errorMessage);

      return result;
    }
  }

  const shouldSkipMagnitudeValidation = requireNonZeroMagnitude === false;

  if (shouldSkipMagnitudeValidation) {
    const result = null;

    return result;
  }

  const magnitude = getVectorMagnitude({ vector });
  const hasZeroMagnitude = magnitude === 0;

  if (hasZeroMagnitude) {
    const errorMessage = createZeroMagnitudeVectorErrorMessage({ vectorName });
    const result = new Error(errorMessage);

    return result;
  }

  const result = null;

  return result;
};

export type GetVectorCollectionValidationErrorProps = {
  readonly vectors: VectorCollection;
};

export const getVectorCollectionValidationError = (
  props: GetVectorCollectionValidationErrorProps,
) => {
  const { vectors } = props;
  const firstVector = vectors[0];

  if (firstVector === undefined) {
    const result = null;

    return result;
  }

  const expectedLength = firstVector.length;
  const indexedVectors = vectors.entries();

  for (const [vectorIndex, vector] of indexedVectors) {
    const vectorName = `vectors[${vectorIndex}]`;
    const vectorValidationError = getVectorValidationError({
      requireNonZeroMagnitude: true,
      vector,
      vectorName,
    });

    if (vectorValidationError !== null) {
      return vectorValidationError;
    }

    const receivedLength = vector.length;
    const hasMismatchedLength = receivedLength !== expectedLength;

    if (hasMismatchedLength) {
      const errorMessage = createMismatchedVectorLengthErrorMessage({
        expectedLength,
        receivedLength,
        vectorName,
      });
      const result = new Error(errorMessage);

      return result;
    }
  }

  const result = null;

  return result;
};
