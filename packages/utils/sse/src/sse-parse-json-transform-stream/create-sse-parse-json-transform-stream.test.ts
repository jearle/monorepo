import { test, expect } from 'bun:test';

import { processStreamChunks } from '@jearle/util-stream';

import {
  SSE_TRANSFORM_STREAM_STATUS_DATA,
  SSE_TRANSFORM_STREAM_STATUS_DONE,
} from '../sse-parse-transform-stream';

import type { SSEParseJSONTransformStreamInput } from './types';
import { createSSEParseJSONTransformStream } from './create-sse-parse-json-transform-stream';

type TestJSONTransformStreamInputs = [
  SSEParseJSONTransformStreamInput,
  SSEParseJSONTransformStreamInput,
];

type TestData = { readonly message: string };

const TEST_STREAM_INPUTS: TestJSONTransformStreamInputs = [
  { data: `{"message": "hello"}`, status: SSE_TRANSFORM_STREAM_STATUS_DATA },
  { data: `[DONE]`, status: SSE_TRANSFORM_STREAM_STATUS_DONE },
];

const processChunks = async () => {
  const { sseParseJSONTransformStream } =
    createSSEParseJSONTransformStream<TestData>();

  const outputs = await processStreamChunks({
    stream: sseParseJSONTransformStream,
    chunks: TEST_STREAM_INPUTS,
  });

  return outputs;
};

test('parses valid JSON', async () => {
  const [output1, output2] = await processChunks();
  console.log(output1);

  if (output1 === undefined) {
    expect(output1).toBeDefined();
    return;
  }

  if (output2 !== undefined) {
    expect(output1).toBeUndefined();
    return;
  }

  const { success } = output1;
  if (success !== true) {
    expect(success).toBeTrue();
    return;
  }

  const { message } = output1.data;

  expect(message).toBe(`hello`);
});
