import { expect, test } from 'bun:test';

import { RESULT_STATUS_ERROR, wrapResultError } from '..';

test(`wrapResultError({ error }) returns an error result`, () => {
  const resultError = {
    message: `failed`,
    code: `FAILED`,
  };
  const result = wrapResultError({
    error: resultError,
  });

  expect(result).toEqual({
    status: RESULT_STATUS_ERROR,
    error: resultError,
  });
});
