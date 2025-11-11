import { test, expect } from 'bun:test';

import { processStreamChunks } from '@jearle/util-stream';

import { createSSEStringifyTransformStream } from './create-sse-stringify-transform-stream';
import { SSE_FIELD_NAME_DATA, SSE_FIELD_VALUE_DONE } from '../sse-string';

test('createSSEStringifyTransformStream(string)', async () => {
  const { sseStringifyTransformStream } = createSSEStringifyTransformStream();

  const chunks = ['{"hello":"world"}'];

  const outputs = await processStreamChunks({
    stream: sseStringifyTransformStream,
    chunks,
  });

  // Test the graceful close path (flush is called)
  expect(outputs).toEqual([
    `${SSE_FIELD_NAME_DATA}: {"hello":"world"}\n\n`,
    `${SSE_FIELD_NAME_DATA}: ${SSE_FIELD_VALUE_DONE}\n\n`,
  ]);
});

test('createSSEStringifyTransformStream(DONE signal)', async () => {
  const { sseStringifyTransformStream } = createSSEStringifyTransformStream();

  const chunks = ['{"data":123}', SSE_FIELD_VALUE_DONE];

  const outputs = await processStreamChunks({
    stream: sseStringifyTransformStream,
    chunks,
  });

  // Test the imperative termination path (transform sends the DONE message)
  // The stream terminates, so the flush() is never called, preventing a double message.
  expect(outputs).toEqual([
    `${SSE_FIELD_NAME_DATA}: {"data":123}\n\n`,
    `${SSE_FIELD_NAME_DATA}: ${SSE_FIELD_VALUE_DONE}\n\n`,
  ]);
});
