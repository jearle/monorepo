import { expect, test } from 'bun:test';

import {
  MATH_RESULT_STATUS_ERROR,
  MATH_RESULT_STATUS_SUCCESS,
} from '../constants';
import {
  getDotProduct,
  getVectorCollectionValidationError,
  getVectorMagnitude,
  getVectorValidationError,
} from '.';

const expectErrorMessage = (error: Error | null, message: string) => {
  if (error === null) {
    expect.unreachable(`Expected an Error instance.`);
  }

  expect(error).toBeInstanceOf(Error);
  expect(error.message).toBe(message);
};

test(`returns the dot product for equal-length vectors`, () => {
  const result = getDotProduct({
    vector1: [1, 2],
    vector2: [3, 4],
  });

  expect(result.status).toBe(MATH_RESULT_STATUS_SUCCESS);

  if (result.status !== MATH_RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  const { dotProduct } = result.data;

  expect(dotProduct).toBe(11);
});

test(`returns a deterministic error for mismatched vector lengths`, () => {
  const result = getDotProduct({
    vector1: [1, 2],
    vector2: [3, 4, 5],
  });

  expect(result.status).toBe(MATH_RESULT_STATUS_ERROR);

  if (result.status !== MATH_RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  expectErrorMessage(
    result.error,
    `vector2: vectors must have the same length, expected length 2, received 3`,
  );
});

test(`returns zero for the magnitude of a zero vector`, () => {
  const magnitude = getVectorMagnitude({
    vector: [0, 0],
  });

  expect(magnitude).toBe(0);
});

test(`returns the magnitude of a single-value vector`, () => {
  const magnitude = getVectorMagnitude({
    vector: [3],
  });

  expect(magnitude).toBe(3);
});

test(`returns the magnitude for vectors with negative values`, () => {
  const magnitude = getVectorMagnitude({
    vector: [-3, 4],
  });

  expect(magnitude).toBe(5);
});

test(`stabilizes the magnitude of tiny finite vectors`, () => {
  const magnitude = getVectorMagnitude({
    vector: [1e-320, 1e-320],
  });
  const normalizedMagnitude = magnitude / 1e-320;

  expect(magnitude).toBeGreaterThan(0);
  expect(normalizedMagnitude).toBeCloseTo(Math.sqrt(2), 3);
});

test(`stabilizes the magnitude of huge finite vectors`, () => {
  const magnitude = getVectorMagnitude({
    vector: [1e308, 1e308],
  });
  const normalizedMagnitude = magnitude / 1e308;

  expect(magnitude).toBeFinite();
  expect(normalizedMagnitude).toBeCloseTo(Math.sqrt(2), 12);
});

test(`returns an error for empty vectors`, () => {
  const error = getVectorValidationError({
    requireNonZeroMagnitude: true,
    vector: [],
    vectorName: `vector`,
  });

  expectErrorMessage(error, `vector: vector must contain at least one value`);
});

test(`returns an error for non-finite vector values`, () => {
  const error = getVectorValidationError({
    requireNonZeroMagnitude: true,
    vector: [1, Number.NaN],
    vectorName: `vector`,
  });

  expectErrorMessage(error, `vector[1]: vector values must be finite numbers`);
});

test(`returns an error for zero-magnitude vectors when required`, () => {
  const error = getVectorValidationError({
    requireNonZeroMagnitude: true,
    vector: [0, 0],
    vectorName: `vector`,
  });

  expectErrorMessage(
    error,
    `vector: vector magnitude must be greater than zero`,
  );
});

test(`allows zero-magnitude vectors when non-zero magnitude is not required`, () => {
  const error = getVectorValidationError({
    requireNonZeroMagnitude: false,
    vector: [0, 0],
    vectorName: `vector`,
  });

  expect(error).toBeNull();
});

test(`returns an error for vector collections with mismatched lengths`, () => {
  const error = getVectorCollectionValidationError({
    vectors: [
      [1, 0],
      [1, 0, 0],
    ],
  });

  expectErrorMessage(
    error,
    `vectors[1]: vectors must have the same length, expected length 2, received 3`,
  );
});
