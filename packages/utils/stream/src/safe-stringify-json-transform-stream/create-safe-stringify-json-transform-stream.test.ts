import { test, expect } from 'bun:test';

import { processStreamChunks } from '../test';

import { createSafeStringifyJSONTransformStream } from './create-safe-stringify-json-transform-stream';

test('createSafeStringifyJSONTransformStream(object)', async () => {
  const { safeStringifyJSONTransformStream } =
    createSafeStringifyJSONTransformStream();

  const chunks = [{ data: { hello: 'world' } }];

  const outputs = await processStreamChunks({
    stream: safeStringifyJSONTransformStream,
    chunks,
  });

  const result = outputs[0];

  expect(result).toEqual({
    success: true,
    data: '{"hello":"world"}',
  });
});

test('createSafeStringifyJSONTransformStream(null)', async () => {
  const { safeStringifyJSONTransformStream } =
    createSafeStringifyJSONTransformStream();

  const chunks = [{ data: null }];

  const outputs = await processStreamChunks({
    stream: safeStringifyJSONTransformStream,
    chunks,
  });

  const result = outputs[0];

  if (result === undefined) {
    expect(result).toBeDefined();
    return;
  }

  expect(result.success).toBeFalse();
  if (!result.success) {
    expect(result.error).toBeInstanceOf(Error);
  }
});
