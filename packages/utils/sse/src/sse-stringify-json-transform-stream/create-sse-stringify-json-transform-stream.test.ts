import { expect, test } from 'bun:test';

import { processStreamChunks } from '@jearle/util-stream';

import { createSSEStringifyJSONTransformStream } from '.';

test(`createSSEStringifyJSONTransformStream(object)`, async () => {
  const { sseStringifyJSONTransformStream } =
    createSSEStringifyJSONTransformStream();

  const chunks = [{ data: { hello: `world` } }];

  const outputs = await processStreamChunks({
    stream: sseStringifyJSONTransformStream,
    chunks,
  });

  expect(outputs).toEqual([`{"hello":"world"}`, `[DONE]`]);
});

test(`createSSEStringifyJSONTransformStream(invalidObject)`, async () => {
  const { sseStringifyJSONTransformStream } =
    createSSEStringifyJSONTransformStream();

  const chunks = [{ data: null }];

  const [output] = await processStreamChunks({
    stream: sseStringifyJSONTransformStream,
    chunks,
  });

  expect(output).toMatch(/\{"error":/);
});
