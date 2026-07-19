import { expect, test } from 'bun:test';

import { createResultErrorFromUnknown } from '..';

test(`createResultErrorFromUnknown({ error }) normalizes Error values`, () => {
  const result = createResultErrorFromUnknown({
    error: new Error(`failed`),
  });

  expect(result).toEqual({
    message: `failed`,
  });
});

test(`createResultErrorFromUnknown({ error, code }) preserves codes`, () => {
  const result = createResultErrorFromUnknown({
    code: `FAILED`,
    error: `failed`,
  });

  expect(result).toEqual({
    message: `failed`,
    code: `FAILED`,
  });
});
