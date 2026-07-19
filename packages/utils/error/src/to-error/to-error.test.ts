import { expect, test } from 'bun:test';

import { toError } from '..';

test(`toError({ resultError }) converts result errors to Error values`, () => {
  const result = toError({
    resultError: {
      message: `failed`,
    },
  });

  expect(result).toBeInstanceOf(Error);
  expect(result.message).toBe(`failed`);
});

test(`toError({ resultError }) preserves codes when present`, () => {
  const result = toError({
    resultError: {
      message: `failed`,
      code: `FAILED`,
    },
  });

  expect(result).toBeInstanceOf(Error);
  expect(`code` in result).toBe(true);

  if (`code` in result === false) {
    expect.unreachable();
  }

  expect(result.code).toBe(`FAILED`);
});
