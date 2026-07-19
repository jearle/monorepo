import { expect, setDefaultTimeout, test } from 'bun:test';

import {
  OpenAICompletionChunkSchema,
  OpenAICompletionSchema,
} from '../open-ai-chat';
import { createEnv } from '../env';

import { fetchOpenrouterChatCompletions } from './fetch-openrouter-chat-completions';

setDefaultTimeout(30000);

const RATE_LIMIT_STATUS = 429;
const RATE_LIMIT_MESSAGE = `Rate limit exceeded`;

const createTestFetchOpenrouterChatCompletionsProps = () => {
  const { env } = createEnv();
  const { OPENROUTER_API, OPENROUTER_API_KEY, OPENROUTER_MODEL } = env;

  const result = {
    api: OPENROUTER_API,
    apiKey: OPENROUTER_API_KEY,
    model: OPENROUTER_MODEL,
  };

  return result;
};

const assertRateLimitResponse = (
  responseStatus: number,
  responseText: string,
) => {
  const hasRateLimitMessage = responseText.includes(RATE_LIMIT_MESSAGE);

  expect(responseStatus).toBe(RATE_LIMIT_STATUS);
  expect(hasRateLimitMessage).toBeTrue();
};

test.skip(`fetchOpenrouterChatCompletions({ stream: false })`, async () => {
  const { api, apiKey, model } =
    createTestFetchOpenrouterChatCompletionsProps();

  const { response } = await fetchOpenrouterChatCompletions({
    api,
    apiKey,
    model,
    stream: false,
    system: `you're a helpful assistant`,
    user: `hello`,
  });

  const responseStatus = response.status;
  const responseOK = response.ok;
  const responseText = await response.text();

  if (responseOK === false) {
    assertRateLimitResponse(responseStatus, responseText);

    return;
  }

  const json = JSON.parse(responseText);

  expect(responseStatus).toBe(200);
  expect(responseOK).toBeTrue();

  const parsedJSON = OpenAICompletionSchema.safeParse(json);
  const { success } = parsedJSON;

  expect(success).toBeTrue();

  if (success === false) {
    expect.unreachable();
  }

  const { data: completion } = parsedJSON;
  const { choices } = completion;
  const [firstChoice] = choices;

  if (firstChoice === undefined) {
    expect.unreachable();
  }

  const { message } = firstChoice;
  const { content } = message;

  expect(content).toBeString();
});

test.skip(`fetchOpenrouterChatCompletions({ stream: true })`, async () => {
  const { api, apiKey, model } =
    createTestFetchOpenrouterChatCompletionsProps();

  const { response } = await fetchOpenrouterChatCompletions({
    api,
    apiKey,
    model,
    stream: true,
    system: `you're a helpful assistant`,
    user: `hello`,
  });

  const responseStatus = response.status;
  const responseOK = response.ok;
  const responseText = await response.text();

  if (responseOK === false) {
    assertRateLimitResponse(responseStatus, responseText);

    return;
  }

  const responseLines = responseText.split(/\r?\n/);
  const dataLines = responseLines.filter((line) => line.startsWith(`data:`));
  const doneLine = `data: [DONE]`;
  const hasDoneLine = dataLines.includes(doneLine);

  expect(responseStatus).toBe(200);
  expect(responseOK).toBeTrue();
  expect(hasDoneLine).toBeTrue();

  const jsonLines = dataLines.filter((line) => line !== doneLine);
  const [firstJSONLine] = jsonLines;

  if (firstJSONLine === undefined) {
    expect.unreachable();
  }

  const dataPrefix = `data: `;
  const firstJSONText = firstJSONLine.slice(dataPrefix.length);
  const firstJSON = JSON.parse(firstJSONText);
  const parsedFirstJSON = OpenAICompletionChunkSchema.safeParse(firstJSON);
  const { success } = parsedFirstJSON;

  expect(success).toBeTrue();
});
