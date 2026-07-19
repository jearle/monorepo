import { expect, test } from 'bun:test';

import {
  MATH_RESULT_STATUS_ERROR,
  MATH_RESULT_STATUS_SUCCESS,
} from '../constants';
import { type Vector } from '../types';
import {
  type CreateCosineSimilarityMatrixResult,
  createCosineSimilarityMatrix,
} from '.';

const expectMessage = (error: Error | null, message: string) => {
  if (error === null) {
    expect.unreachable(`Expected an Error instance.`);
  }

  expect(error).toBeInstanceOf(Error);
  expect(error.message).toBe(message);
};

const expectSymmetricMatrix = (
  similarityMatrix: readonly (readonly number[])[],
) => {
  const indexedRows = similarityMatrix.entries();

  for (const [rowIndex, row] of indexedRows) {
    const indexedValues = row.entries();

    for (const [columnIndex, value] of indexedValues) {
      const mirroredValue = similarityMatrix[columnIndex]?.[rowIndex];

      expect(mirroredValue).toBe(value);
    }
  }
};

const getSuccessSimilarityMatrix = (
  result: CreateCosineSimilarityMatrixResult,
) => {
  expect(result.status).toBe(MATH_RESULT_STATUS_SUCCESS);

  if (result.status !== MATH_RESULT_STATUS_SUCCESS) {
    expect.unreachable(`Expected a similarity matrix.`);
  }

  return result.data.similarityMatrix;
};

const getFailure = (result: CreateCosineSimilarityMatrixResult) => {
  expect(result.status).toBe(MATH_RESULT_STATUS_ERROR);

  if (result.status !== MATH_RESULT_STATUS_ERROR) {
    expect.unreachable(`Expected an Error instance.`);
  }

  return result.error;
};

test(`returns a symmetric matrix`, () => {
  const result = createCosineSimilarityMatrix({
    vectors: [
      [1, 0],
      [0, 1],
    ],
  });
  const similarityMatrix = getSuccessSimilarityMatrix(result);

  expect(similarityMatrix).toEqual([
    [1, 0],
    [0, 1],
  ]);
});

test(`preserves symmetry across mirrored upper-triangle values`, () => {
  const result = createCosineSimilarityMatrix({
    vectors: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  });
  const similarityMatrix = getSuccessSimilarityMatrix(result);

  expectSymmetricMatrix(similarityMatrix);
  expect(similarityMatrix[0]?.[1]).toBeCloseTo(Math.SQRT1_2, 12);
  expect(similarityMatrix[1]?.[2]).toBeCloseTo(Math.SQRT1_2, 12);
});

test(`accepts vector values typed against the local Vector shape`, () => {
  const vector1: Vector = [1, 0, 0];
  const vector2: Vector = [0, 1, 0];
  const vectors = [vector1, vector2] as const;
  const result = createCosineSimilarityMatrix({
    vectors,
  });
  const similarityMatrix = getSuccessSimilarityMatrix(result);

  expect(similarityMatrix).toEqual([
    [1, 0],
    [0, 1],
  ]);
});

test(`accepts readonly tuple vector values`, () => {
  const vectors = [
    [1, 0, 0],
    [0, 1, 0],
  ] as const;
  const result = createCosineSimilarityMatrix({
    vectors,
  });
  const similarityMatrix = getSuccessSimilarityMatrix(result);

  expect(similarityMatrix).toEqual([
    [1, 0],
    [0, 1],
  ]);
});

test(`returns an empty matrix for empty input`, () => {
  const result = createCosineSimilarityMatrix({
    vectors: [],
  });
  const similarityMatrix = getSuccessSimilarityMatrix(result);

  expect(similarityMatrix).toEqual([]);
});

test(`returns [[1]] for a single input vector`, () => {
  const result = createCosineSimilarityMatrix({
    vectors: [[1, 0]],
  });
  const similarityMatrix = getSuccessSimilarityMatrix(result);

  expect(similarityMatrix).toEqual([[1]]);
});

test(`returns an error for mismatched lengths`, () => {
  const result = createCosineSimilarityMatrix({
    vectors: [
      [1, 0],
      [1, 0, 0],
    ],
  });
  const error = getFailure(result);

  expectMessage(
    error,
    `vectors[1]: vectors must have the same length, expected length 2, received 3`,
  );
});

test(`returns an error for zero-magnitude vectors`, () => {
  const result = createCosineSimilarityMatrix({
    vectors: [
      [1, 0],
      [0, 0],
    ],
  });
  const error = getFailure(result);

  expectMessage(
    error,
    `vectors[1]: vector magnitude must be greater than zero`,
  );
});

test(`returns an error for non-finite values anywhere in the input`, () => {
  const result = createCosineSimilarityMatrix({
    vectors: [
      [1, 0],
      [0, Number.NaN],
    ],
  });
  const error = getFailure(result);

  expectMessage(error, `vectors[1][1]: vector values must be finite numbers`);
});

test(`stabilizes matrices built from tiny finite vectors`, () => {
  const result = createCosineSimilarityMatrix({
    vectors: [
      [1e-320, 1e-320],
      [1e-320, -1e-320],
    ],
  });
  const similarityMatrix = getSuccessSimilarityMatrix(result);

  expect(similarityMatrix[0]?.[0]).toBeCloseTo(1, 12);
  expect(similarityMatrix[0]?.[1]).toBeCloseTo(0, 12);
  expect(similarityMatrix[1]?.[1]).toBeCloseTo(1, 12);
});

test(`stabilizes matrices built from huge finite vectors`, () => {
  const result = createCosineSimilarityMatrix({
    vectors: [
      [1e308, 1e308, 1e308, 1e308],
      [1e308, -1e308, 1e308, -1e308],
    ],
  });
  const similarityMatrix = getSuccessSimilarityMatrix(result);

  expect(similarityMatrix[0]?.[0]).toBeCloseTo(1, 12);
  expect(similarityMatrix[0]?.[1]).toBeCloseTo(0, 12);
  expect(similarityMatrix[1]?.[1]).toBeCloseTo(1, 12);
});

test(`builds a larger symmetric matrix without errors`, () => {
  const vectors = Array.from({ length: 64 }, (_, rowIndex) => {
    return Array.from({ length: 32 }, (_, columnIndex) => {
      const direction = columnIndex % 2 === 0 ? 1 : -1;
      const absoluteValue = rowIndex + columnIndex + 1;
      const value = absoluteValue * direction;

      return value;
    });
  });
  const result = createCosineSimilarityMatrix({
    vectors,
  });
  const similarityMatrix = getSuccessSimilarityMatrix(result);

  expect(similarityMatrix).toHaveLength(64);
  expect(similarityMatrix[0]).toHaveLength(64);
  expect(similarityMatrix[63]).toHaveLength(64);
  expect(similarityMatrix[0]?.[0]).toBe(1);
  expect(similarityMatrix[63]?.[63]).toBe(1);
  expectSymmetricMatrix(similarityMatrix);
});
