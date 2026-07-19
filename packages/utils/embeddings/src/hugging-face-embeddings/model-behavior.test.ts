import { expect, test } from 'bun:test';

import { HUGGING_FACE_EMBEDDING_MODELS } from '.';
import { postprocessEmbeddingVectors } from './postprocess-embedding-vectors';
import { prepareTextsForEmbedding } from './prepare-texts-for-embedding';

test(`prepareTextsForEmbedding() prefixes unscoped Nomic texts for clustering`, () => {
  const texts = [`first row`, `second row`];

  const result = prepareTextsForEmbedding({
    model: HUGGING_FACE_EMBEDDING_MODELS.nomicEmbedTextV15,
    texts,
  });

  expect(result).toEqual([`clustering: first row`, `clustering: second row`]);
});

test(`prepareTextsForEmbedding() preserves existing Nomic task prefixes`, () => {
  const texts = [
    `search_document: first row`,
    `search_query: second row`,
    `clustering: second row`,
    `classification: third row`,
  ];

  const result = prepareTextsForEmbedding({
    model: HUGGING_FACE_EMBEDDING_MODELS.nomicEmbedTextV15,
    texts,
  });

  expect(result).toEqual(texts);
});

test(`prepareTextsForEmbedding() recognizes Nomic local paths by basename`, () => {
  const texts = [`first row`, `second row`];

  const result = prepareTextsForEmbedding({
    model: `/models/nomic-embed-text-v1.5`,
    texts,
  });

  expect(result).toEqual([`clustering: first row`, `clustering: second row`]);
});

test(`prepareTextsForEmbedding() leaves non-Nomic models unchanged`, () => {
  const texts = [`first row`, `second row`];

  const result = prepareTextsForEmbedding({
    model: HUGGING_FACE_EMBEDDING_MODELS.allMiniLmL6V2,
    texts,
  });

  expect(result).toEqual(texts);
});

test(`postprocessEmbeddingVectors() renormalizes Nomic vectors`, () => {
  const vectors = [
    [3, 4, 5],
    [1, 2, 3],
  ] as const;

  const result = postprocessEmbeddingVectors({
    model: HUGGING_FACE_EMBEDDING_MODELS.nomicEmbedTextV15,
    vectors,
  });

  expect(result).toHaveLength(2);
  expect(result[0]).toHaveLength(3);
  expect(result[1]).toHaveLength(3);
  expect(result[0]).not.toEqual(vectors[0]);
  expect(result[1]).not.toEqual(vectors[1]);

  const [firstVector, secondVector] = result;

  if (firstVector === undefined || secondVector === undefined) {
    expect.unreachable();
  }

  const firstNorm = Math.sqrt(
    firstVector.reduce((total, value) => total + value * value, 0),
  );
  const secondNorm = Math.sqrt(
    secondVector.reduce((total, value) => total + value * value, 0),
  );

  expect(firstNorm).toBeCloseTo(1, 6);
  expect(secondNorm).toBeCloseTo(1, 6);
});

test(`postprocessEmbeddingVectors() keeps zero-variance Nomic vectors finite`, () => {
  const vectors = [[7, 7, 7]] as const;

  const result = postprocessEmbeddingVectors({
    model: HUGGING_FACE_EMBEDDING_MODELS.nomicEmbedTextV15,
    vectors,
  });
  const [vector] = result;

  if (vector === undefined) {
    expect.unreachable();
  }

  expect(vector).toEqual([0, 0, 0]);
  expect(vector.every((value) => Number.isFinite(value))).toBe(true);
});
