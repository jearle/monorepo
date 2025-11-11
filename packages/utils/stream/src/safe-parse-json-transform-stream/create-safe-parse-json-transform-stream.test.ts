import { test, expect } from 'bun:test';

import { processStreamChunks } from '../test';

import type {
  JSONTransformStreamInput,
  JSONTransformStreamOutput,
} from './types';
import { createSafeParseJSONTransformStream } from './create-safe-parse-json-transform-stream';

type TestJSONTransformStreamInputs = [
  JSONTransformStreamInput,
  JSONTransformStreamInput,
];

type TestData = { readonly message: string };
type TestJSONTransformStreamOutputs = [
  JSONTransformStreamOutput<TestData>,
  JSONTransformStreamOutput<TestData>,
];

const TEST_STREAM_OUTPUT: TestJSONTransformStreamInputs = [
  { data: `{"message": "hello"}` },
  { data: `{"message": "hello"}` },
];

const processChunks = async (
  chunks: TestJSONTransformStreamInputs = TEST_STREAM_OUTPUT,
) => {
  const { safeParseJSONTransformStream } = createSafeParseJSONTransformStream();
  const outputs: TestJSONTransformStreamOutputs = (await processStreamChunks({
    stream: safeParseJSONTransformStream,
    chunks,
  })) as TestJSONTransformStreamOutputs;

  return outputs;
};

test('parses valid JSON', async () => {
  const [output1, output2] = await processChunks();

  if (output1.success === false) {
    expect(output1.success).toBeTrue();

    return;
  }

  if (output2.success === false) {
    expect(output2.success).toBeTrue();

    return;
  }

  expect(output1.data.message).toBe(`hello`);
  expect(output2.data.message).toBe(`hello`);
});

test('handles invalid JSON', async () => {
  const [, output] = await processChunks([
    TEST_STREAM_OUTPUT[0],
    { data: `invalid` },
  ]);

  const { success } = output;

  if (success === true) {
    expect(success).toBeFalse();

    return;
  }

  const { error } = output;

  expect(error.message).toBeString();
});
