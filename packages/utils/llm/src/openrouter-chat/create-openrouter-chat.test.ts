import { expect, setDefaultTimeout, test } from 'bun:test';

import {
  OPENROUTER_CHAT_RESULT_STATUS_ERROR,
  OPENROUTER_CHAT_RESULT_STATUS_SUCCESS,
} from '.';
import { createTestChat } from '../test';

setDefaultTimeout(30000);

const RATE_LIMIT_STATUS = `status 429`;
const RATE_LIMIT_MESSAGE = `Rate limit exceeded`;

test.skip(`createOpenRouterChat({ api, apiKey, model })`, () => {
  const { chat } = createTestChat();

  expect(chat).toBeDefined();
});

test.skip(`chat.chatCompletions()`, async () => {
  const { chat } = createTestChat();

  const result = await chat.completions({
    system: `you're a helpful assistant`,
    user: `hello`,
  });

  if (result.status === OPENROUTER_CHAT_RESULT_STATUS_ERROR) {
    const { error } = result;
    const hasRateLimitStatus = error.includes(RATE_LIMIT_STATUS);
    const hasRateLimitMessage = error.includes(RATE_LIMIT_MESSAGE);

    expect(hasRateLimitStatus).toBeTrue();
    expect(hasRateLimitMessage).toBeTrue();

    return;
  }

  const { content } = result.data;

  expect(content).toBeString();
});

test.skip(`chat.chatCompletionsStream()`, async () => {
  const { chat } = createTestChat();

  const result = await chat.completionsStream({
    system: `you're a helpful assistant`,
    user: `hello`,
  });

  if (result.status === OPENROUTER_CHAT_RESULT_STATUS_ERROR) {
    const { error } = result;
    const hasRateLimitStatus = error.includes(RATE_LIMIT_STATUS);
    const hasRateLimitMessage = error.includes(RATE_LIMIT_MESSAGE);

    expect(hasRateLimitStatus).toBeTrue();
    expect(hasRateLimitMessage).toBeTrue();

    return;
  }

  expect(result.status).toBe(OPENROUTER_CHAT_RESULT_STATUS_SUCCESS);

  const { stream } = result.data;
  const response = new Response(stream);
  const text = await response.text();
  console.log(text);
  const hasInvalidResponseError = text.includes(
    `Invalid openrouter api response`,
  );

  expect(hasInvalidResponseError).toBeFalse();
  expect(text).toBeString();
});
