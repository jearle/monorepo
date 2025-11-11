import { expect, test } from 'bun:test';

import { createOpenrouterChat } from './create-openrouter-chat';

const { OPENROUTER_API, OPENROUTER_API_KEY, OPENROUTER_MODEL } =
  process.env as { readonly [key: string]: string };

const setupOpenRouterChat = () => {
  const { chat } = createOpenrouterChat({
    api: OPENROUTER_API!,
    apiKey: OPENROUTER_API_KEY!,
    model: OPENROUTER_MODEL!,
  });

  const result = { chat };

  return result;
};

test(`createOpenRouterChat({ api, apiKey, model })`, () => {
  const { chat } = setupOpenRouterChat();

  expect(chat).toBeDefined();
});

test(`chat.chatCompletions()`, async () => {
  const { chat } = setupOpenRouterChat();

  const { error, content } = await chat.completions({
    system: `you're a helpful assistant`,
    user: `hello`,
  });

  expect(error).toBeNull();
  expect(content).toBeString();
});

test(`chat.chatCompletionsStream()`, async () => {
  const { chat } = setupOpenRouterChat();

  const { error, stream } = await chat.completionsStream({
    system: `you're a helpful assistant`,
    user: `hello`,
  });

  expect(error).toBeNull();

  const text = await new Response(stream).text();
  console.log(text);
  expect(text).toBeString();
});
