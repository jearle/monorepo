import { expect, setDefaultTimeout, test } from 'bun:test';

import {
  DEFAULT_HUGGING_FACE_EMBEDDING_MODEL,
  HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR,
  HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS,
  createHuggingFaceEmbeddings,
} from '.';

setDefaultTimeout(300000);

const getVectorL2Norm = (vector: readonly number[]) => {
  const sumOfSquares = vector.reduce((total, value) => {
    const result = total + value * value;

    return result;
  }, 0);
  const l2Norm = Math.sqrt(sumOfSquares);
  const result = l2Norm;

  return result;
};

test(`createHuggingFaceEmbeddings({ model }).embed({ texts }) runs against a real local model`, async () => {
  const { embeddings } = createHuggingFaceEmbeddings({
    model: DEFAULT_HUGGING_FACE_EMBEDDING_MODEL,
  });
  const result = await embeddings.embed({
    texts: [`hello world`, `hugging face`],
  });

  expect(result.status).toBe(HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_SUCCESS);

  if (result.status === HUGGING_FACE_EMBEDDINGS_RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  const { vectors } = result.data;

  expect(vectors).toBeArray();

  const vectorCount = vectors.length;
  const firstVector = vectors[0];
  const secondVector = vectors[1];

  expect(vectorCount).toBe(2);

  if (firstVector === undefined) {
    expect.unreachable();
  }

  if (secondVector === undefined) {
    expect.unreachable();
  }

  const firstVectorLength = firstVector.length;
  const secondVectorLength = secondVector.length;

  expect(firstVector).toBeArray();
  expect(secondVector).toBeArray();
  expect(firstVectorLength).toBeGreaterThan(0);
  expect(secondVectorLength).toBeGreaterThan(0);
  expect(firstVectorLength).toBe(secondVectorLength);
  expect(firstVector).not.toEqual(secondVector);
  expect(getVectorL2Norm(firstVector)).toBeCloseTo(1, 5);
  expect(getVectorL2Norm(secondVector)).toBeCloseTo(1, 5);
});
