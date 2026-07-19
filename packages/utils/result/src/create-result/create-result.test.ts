import { expect, test } from 'bun:test';

import {
  RESULT_STATUS_ERROR,
  RESULT_STATUS_SUCCESS,
  createResultError,
  createResultSuccess,
} from '..';

test(`createResultSuccess({ data }) returns a success result`, () => {
  const result = createResultSuccess({
    data: `value`,
  });

  expect(result).toEqual({
    status: RESULT_STATUS_SUCCESS,
    data: `value`,
  });
});

test(`createResultError({ message, code }) returns an error result`, () => {
  const result = createResultError({
    message: `failed`,
    code: `FAILED`,
  });

  expect(result).toEqual({
    status: RESULT_STATUS_ERROR,
    error: {
      message: `failed`,
      code: `FAILED`,
    },
  });
});
