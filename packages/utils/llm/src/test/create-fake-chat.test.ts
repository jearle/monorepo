import { expect, test } from 'bun:test';

import { OPENROUTER_CHAT_RESULT_STATUS_SUCCESS } from '../openrouter-chat';

import { createFakeChat } from '.';

test(`createFakeChat({ completion }) returns an injected chat test double`, async () => {
  const { calls, chat } = createFakeChat({
    completion: {
      status: OPENROUTER_CHAT_RESULT_STATUS_SUCCESS,
      data: {
        content: `generated text`,
      },
    },
  });
  const result = await chat.completions({
    system: `system`,
    user: `user`,
  });

  expect(result).toEqual({
    status: OPENROUTER_CHAT_RESULT_STATUS_SUCCESS,
    data: {
      content: `generated text`,
    },
  });
  expect(calls).toEqual([
    {
      system: `system`,
      user: `user`,
    },
  ]);
});
