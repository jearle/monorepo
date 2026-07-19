import { expect, setDefaultTimeout, test } from 'bun:test';

import { createEnv } from '../env';

import { OpenAIEmbeddingsResponseSchema } from '.';
import { fetchOpenrouterEmbeddings } from './fetch-openrouter-embeddings';

setDefaultTimeout(30000);

const RATE_LIMIT_STATUS = 429;
const RATE_LIMIT_MESSAGE = `Rate limit exceeded`;

const createTestFetchOpenrouterEmbeddingsProps = () => {
  const { env } = createEnv();
  const { OPENROUTER_API, OPENROUTER_API_KEY, OPENROUTER_EMBEDDINGS_MODEL } =
    env;

  const result = {
    api: OPENROUTER_API,
    apiKey: OPENROUTER_API_KEY,
    model: OPENROUTER_EMBEDDINGS_MODEL,
  };

  return result;
};

test(`OpenAIEmbeddingsResponseSchema accepts usage-absent responses`, () => {
  const response = {
    data: [
      {
        embedding: [0.1, 0.2],
        index: 0,
      },
    ],
    model: `qwen3-embedding:8b`,
  };

  const result = OpenAIEmbeddingsResponseSchema.safeParse(response);

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.data.usage).toBeUndefined();
});

test.skip(`fetchOpenrouterEmbeddings({ texts: ['hello'] })`, async () => {
  const { api, apiKey, model } = createTestFetchOpenrouterEmbeddingsProps();

  const { response } = await fetchOpenrouterEmbeddings({
    api,
    apiKey,
    model,
    texts: [`hello`],
  });

  const responseStatus = response.status;
  const responseOK = response.ok;
  const responseText = await response.text();

  if (responseOK === false) {
    const hasRateLimitMessage = responseText.includes(RATE_LIMIT_MESSAGE);

    expect(responseStatus).toBe(RATE_LIMIT_STATUS);
    expect(hasRateLimitMessage).toBeTrue();

    return;
  }

  const json = JSON.parse(responseText);

  expect(responseStatus).toBe(200);
  expect(responseOK).toBeTrue();

  const parsedJSON = OpenAIEmbeddingsResponseSchema.safeParse(json);
  const { success } = parsedJSON;

  expect(success).toBeTrue();

  if (success === false) {
    expect.unreachable();
  }

  const { data: embeddingsResponse } = parsedJSON;
  const { data } = embeddingsResponse;
  const [firstEmbedding] = data;

  if (firstEmbedding === undefined) {
    expect.unreachable();
  }

  const { embedding } = firstEmbedding;

  expect(embedding).toBeArray();
});
