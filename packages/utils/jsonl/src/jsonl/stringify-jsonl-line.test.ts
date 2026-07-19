import { expect, test } from 'bun:test';

import { stringifyJsonlLine } from '.';

test(`stringifyJsonlLine reuses stable JSON ordering`, () => {
  const result = stringifyJsonlLine({
    value: {
      z: 2,
      a: {
        d: 4,
        b: 2,
      },
    },
  });

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.data).toBe(`{"a":{"b":2,"d":4},"z":2}`);
});

test(`stringifyJsonlLine preserves array order`, () => {
  const result = stringifyJsonlLine({
    value: {
      messages: [
        {
          role: `user`,
          content: `first`,
        },
        {
          role: `assistant`,
          content: `second`,
        },
      ],
    },
  });

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.data).toBe(
    `{"messages":[{"content":"first","role":"user"},{"content":"second","role":"assistant"}]}`,
  );
});
