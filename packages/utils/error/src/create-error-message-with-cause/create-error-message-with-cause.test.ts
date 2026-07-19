import { expect, test } from 'bun:test';

import { createErrorMessageWithCause } from '..';

test(`createErrorMessageWithCause({ prefix, cause }) formats Error causes`, () => {
  const result = createErrorMessageWithCause({
    cause: new Error(`known`),
    prefix: `request failed`,
  });

  expect(result).toBe(`request failed: known`);
});

test(`createErrorMessageWithCause({ prefix, cause }) normalizes unknown causes`, () => {
  const result = createErrorMessageWithCause({
    cause: `unknown`,
    prefix: `request failed`,
  });

  expect(result).toBe(`request failed: unknown`);
});
