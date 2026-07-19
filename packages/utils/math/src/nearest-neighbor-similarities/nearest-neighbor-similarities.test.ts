import { expect, test } from 'bun:test';

import {
  MATH_RESULT_STATUS_ERROR,
  MATH_RESULT_STATUS_SUCCESS,
} from '../constants';
import {
  type GetNearestNeighborSimilaritiesResult,
  getNearestNeighborSimilarities,
} from '.';

const expectMessage = (error: Error | null, message: string) => {
  if (error === null) {
    expect.unreachable(`Expected an Error instance.`);
  }

  expect(error).toBeInstanceOf(Error);
  expect(error.message).toBe(message);
};

const getSuccessNearestNeighborSimilarities = (
  result: GetNearestNeighborSimilaritiesResult,
) => {
  expect(result.status).toBe(MATH_RESULT_STATUS_SUCCESS);

  if (result.status !== MATH_RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  return result.data.nearestNeighborSimilarities;
};

const getFailure = (result: GetNearestNeighborSimilaritiesResult) => {
  expect(result.status).toBe(MATH_RESULT_STATUS_ERROR);

  if (result.status !== MATH_RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  return result.error;
};

test(`excludes self-comparison values`, () => {
  const result = getNearestNeighborSimilarities({
    similarityMatrix: [
      [1, 0.2, 0.4],
      [0.2, 1, 0.3],
      [0.4, 0.3, 1],
    ],
  });
  const nearestNeighborSimilarities =
    getSuccessNearestNeighborSimilarities(result);

  expect(nearestNeighborSimilarities).toEqual([0.4, 0.3, 0.4]);
});

test(`returns an error for a single-row matrix`, () => {
  const result = getNearestNeighborSimilarities({
    similarityMatrix: [[1]],
  });
  const error = getFailure(result);

  expectMessage(
    error,
    `similarity matrix must contain at least two rows to compute nearest-neighbor similarities`,
  );
});

test(`returns an empty collection for an empty matrix`, () => {
  const result = getNearestNeighborSimilarities({
    similarityMatrix: [],
  });
  const nearestNeighborSimilarities =
    getSuccessNearestNeighborSimilarities(result);

  expect(nearestNeighborSimilarities).toEqual([]);
});

test(`keeps the least-negative neighbor for each row in an all-negative matrix`, () => {
  const result = getNearestNeighborSimilarities({
    similarityMatrix: [
      [1, -0.8, -0.3],
      [-0.8, 1, -0.4],
      [-0.3, -0.4, 1],
    ],
  });
  const nearestNeighborSimilarities =
    getSuccessNearestNeighborSimilarities(result);

  expect(nearestNeighborSimilarities).toEqual([-0.3, -0.4, -0.3]);
});

test(`returns an error for non-square matrices`, () => {
  const result = getNearestNeighborSimilarities({
    similarityMatrix: [[1, 0.2], [0.2]],
  });
  const error = getFailure(result);

  expectMessage(
    error,
    `similarity matrix must be square, row 1 expected length 2, received 1`,
  );
});

test(`returns an error for non-finite values`, () => {
  const result = getNearestNeighborSimilarities({
    similarityMatrix: [
      [1, Number.NaN],
      [0.2, 1],
    ],
  });
  const error = getFailure(result);

  expectMessage(
    error,
    `similarityMatrix[0][1]: similarity matrix values must be finite numbers`,
  );
});
