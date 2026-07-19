import { expect, test } from 'bun:test';

import { createJsonlContent } from '.';

test(`createJsonlContent builds newline-terminated deterministic JSONL`, () => {
  const result = createJsonlContent({
    values: [
      {
        z: 2,
        a: 1,
      },
      {
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
    ],
  });

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.lines).toEqual([
    `{"a":1,"z":2}`,
    `{"messages":[{"content":"first","role":"user"},{"content":"second","role":"assistant"}]}`,
  ]);
  expect(result.content).toBe(`${result.lines.join(`\n`)}
`);
});

test(`createJsonlContent returns empty content for empty values`, () => {
  const result = createJsonlContent({ values: [] });

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.lines).toEqual([]);
  expect(result.content).toBe(``);
});

test(`createJsonlContent returns stringify failures`, () => {
  const result = createJsonlContent({
    values: [undefined],
  });

  expect(result.success).toBeFalse();

  if (result.success === true) {
    expect.unreachable();
  }

  expect(result.error.message).toContain(`not JSON serializable`);
});
