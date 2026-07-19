import { expect, setDefaultTimeout, test } from 'bun:test';

import {
  OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR,
  OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS,
} from '.';
import { createTestEmbeddings } from '../test';

setDefaultTimeout(30000);

test.skip(`createOpenrouterEmbeddings({ api, apiKey, model })`, () => {
  const { embeddings } = createTestEmbeddings();

  expect(embeddings).toBeDefined();
});

test.skip(`embeddings.embed({ texts: ['hello'] })`, async () => {
  const { embeddings } = createTestEmbeddings();

  const result = await embeddings.embed({ texts: [`hello`] });

  expect(result.status).toBe(OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS);

  if (result.status === OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  const { vectors } = result.data;

  expect(vectors).toBeArray();
  expect(vectors.length).toBe(1);
  expect(vectors[0]).toBeArray();
});

test.skip(`embeddings.embed({ texts: [] })`, async () => {
  const { embeddings } = createTestEmbeddings();

  const result = await embeddings.embed({ texts: [] });

  expect(result.status).toBe(OPENROUTER_EMBEDDINGS_RESULT_STATUS_ERROR);

  if (result.status === OPENROUTER_EMBEDDINGS_RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  expect(result.error).toBe(`no texts provided`);
});
