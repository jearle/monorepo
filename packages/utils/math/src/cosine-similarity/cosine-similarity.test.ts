import { expect, test } from 'bun:test';

import {
  MATH_RESULT_STATUS_ERROR,
  MATH_RESULT_STATUS_SUCCESS,
} from '../constants';
import { getCosineSimilarity } from '.';

const expectErrorMessage = (error: Error | null, message: string) => {
  if (error === null) {
    expect.unreachable(`Expected an Error instance.`);
  }

  expect(error).toBeInstanceOf(Error);
  expect(error.message).toBe(message);
};

test(`returns 1 for identical vectors`, () => {
  const result = getCosineSimilarity({
    vector1: [1, 2, 3],
    vector2: [1, 2, 3],
  });

  expect(result.status).toBe(MATH_RESULT_STATUS_SUCCESS);

  if (result.status !== MATH_RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  const { similarity } = result.data;

  expect(similarity).toBeCloseTo(1, 12);
});

test(`returns 0 for orthogonal vectors`, () => {
  const result = getCosineSimilarity({
    vector1: [1, 0],
    vector2: [0, 1],
  });

  expect(result.status).toBe(MATH_RESULT_STATUS_SUCCESS);

  if (result.status !== MATH_RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  const { similarity } = result.data;

  expect(similarity).toBeCloseTo(0, 12);
});

test(`returns -1 for opposite vectors`, () => {
  const result = getCosineSimilarity({
    vector1: [1, 0],
    vector2: [-1, 0],
  });

  expect(result.status).toBe(MATH_RESULT_STATUS_SUCCESS);

  if (result.status !== MATH_RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  const { similarity } = result.data;

  expect(similarity).toBeCloseTo(-1, 12);
});

test(`returns an error for mismatched lengths`, () => {
  const result = getCosineSimilarity({
    vector1: [1, 2],
    vector2: [1, 2, 3],
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

test(`returns an error for zero-magnitude values in vector2`, () => {
  const result = getCosineSimilarity({
    vector1: [1, 0],
    vector2: [0, 0],
  });

  expect(result.status).toBe(MATH_RESULT_STATUS_ERROR);

  if (result.status !== MATH_RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  expectErrorMessage(
    result.error,
    `vector2: vector magnitude must be greater than zero`,
  );
});

test(`returns an error for non-finite values in vector2`, () => {
  const result = getCosineSimilarity({
    vector1: [1, 2],
    vector2: [1, Number.NaN],
  });

  expect(result.status).toBe(MATH_RESULT_STATUS_ERROR);

  if (result.status !== MATH_RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  expectErrorMessage(
    result.error,
    `vector2[1]: vector values must be finite numbers`,
  );
});

test(`returns 1 for identical tiny finite vectors`, () => {
  const result = getCosineSimilarity({
    vector1: [1e-320, 1e-320],
    vector2: [1e-320, 1e-320],
  });

  expect(result.status).toBe(MATH_RESULT_STATUS_SUCCESS);

  if (result.status !== MATH_RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  const { similarity } = result.data;

  expect(similarity).toBeCloseTo(1, 12);
});

test(`returns 1 for identical huge finite vectors`, () => {
  const result = getCosineSimilarity({
    vector1: [1e308, 1e308, 1e308, 1e308],
    vector2: [1e308, 1e308, 1e308, 1e308],
  });

  expect(result.status).toBe(MATH_RESULT_STATUS_SUCCESS);

  if (result.status !== MATH_RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  const { similarity } = result.data;

  expect(similarity).toBeCloseTo(1, 12);
});
