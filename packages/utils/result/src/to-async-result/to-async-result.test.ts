import { expect, test } from 'bun:test';

import { RESULT_STATUS_ERROR, RESULT_STATUS_SUCCESS, toAsyncResult } from '..';

test(`toAsyncResult({ operation }) returns data for a resolved promise`, async () => {
  const result = await toAsyncResult({
    operation: async () => `value`,
  });

  expect(result).toEqual({
    status: RESULT_STATUS_SUCCESS,
    data: `value`,
  });
});

test(`toAsyncResult({ operation }) returns an Error for a rejected Error`, async () => {
  const error = new Error(`failed`);
  const result = await toAsyncResult({
    operation: async () => {
      throw error;
    },
  });

  expect(result.status).toBe(RESULT_STATUS_ERROR);

  if (result.status === RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  expect(result.error).toEqual({
    message: error.message,
  });
});

test(`toAsyncResult({ operation }) normalizes a rejected non-Error`, async () => {
  const result = await toAsyncResult({
    operation: async () => {
      throw `failed`;
    },
  });

  expect(result.status).toBe(RESULT_STATUS_ERROR);

  if (result.status === RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  expect(result.error.message).toBe(`failed`);
});
