import { expect, test } from 'bun:test';

import {
  type NodeCallback,
  RESULT_STATUS_ERROR,
  RESULT_STATUS_SUCCESS,
  toNodeCallbackResult,
} from '..';

test(`toNodeCallbackResult({ operation, args }) returns callback data`, async () => {
  const operation = (
    prefix: string,
    value: string,
    callback: NodeCallback<string>,
  ) => {
    callback(null, `${prefix}-${value}`);
  };
  const result = await toNodeCallbackResult({
    operation,
    args: [`hello`, `world`] as const,
  });

  expect(result).toEqual({
    status: RESULT_STATUS_SUCCESS,
    data: `hello-world`,
  });
});

test(`toNodeCallbackResult({ operation, args }) returns callback errors`, async () => {
  const error = new Error(`failed`);
  const operation = (value: string, callback: NodeCallback<string>) => {
    callback(error, value);
  };
  const result = await toNodeCallbackResult({
    operation,
    args: [`value`] as const,
  });

  expect(result.status).toBe(RESULT_STATUS_ERROR);

  if (result.status === RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  expect(result.error).toEqual({
    message: error.message,
  });
});
