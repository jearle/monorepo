import { expect, test } from 'bun:test';

import { createError } from '.';

test(`createError(Error)`, () => {
  const error = new Error(`known`);
  const result = createError(error);

  expect(result).toBe(error);
});

test(`createError(unknown)`, () => {
  const result = createError(`unknown`);

  expect(result).toBeInstanceOf(Error);
  expect(result.message).toBe(`unknown`);
});
