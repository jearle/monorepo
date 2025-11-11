import { test, expect } from 'bun:test';

import { type SSEParseTransformStreamOutput } from './types';
import {
  SSE_TRANSFORM_STREAM_STATUS_DATA,
  SSE_TRANSFORM_STREAM_STATUS_DONE,
} from './constants';
import { createSSEParseTransformStream } from './create-sse-transform-stream';

const encode = (text: string) => new TextEncoder().encode(text);

const processChunks = async (chunks: string[]) => {
  const { sseParseTransformStream } = createSSEParseTransformStream();
  const outputs: SSEParseTransformStreamOutput[] = [];

  const reader = sseParseTransformStream.readable.getReader();
  const writer = sseParseTransformStream.writable.getWriter();

  const readPromise = (async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      outputs.push(value);
    }
  })();

  for (const chunk of chunks) {
    await writer.write(encode(chunk));
  }

  try {
    await writer.close();
  } catch {
    // Stream may have been terminated by [DONE], ignore close error
  }

  await readPromise;
  return outputs;
};

test('basic SSE parsing', async () => {
  const [output] = await processChunks(['data: hello\n\n']);
  if (output === undefined) {
    expect(output).toBeDefined();
    return;
  }
  expect(output.data).toBe('hello');
  expect(output.status).toBe(SSE_TRANSFORM_STREAM_STATUS_DATA);
});

test('DONE signal terminates stream', async () => {
  const results = await processChunks(['data: [DONE]\n\n']);
  const [output] = results;
  if (output === undefined) {
    expect(output).toBeDefined();
    return;
  }
  expect(output.data).toBe('[DONE]');
  expect(output.status).toBe(SSE_TRANSFORM_STREAM_STATUS_DONE);
});

test('chunked data across writes', async () => {
  const [output] = await processChunks(['data: hel', 'lo\n\n']);
  if (output === undefined) {
    expect(output).toBeDefined();
    return;
  }
  expect(output.data).toBe('hello');
});

test('full SSE fields', async () => {
  const [output] = await processChunks([
    'event: test\nid: 123\ndata: hello\n\n',
  ]);
  if (output === undefined) {
    expect(output).toBeDefined();
    return;
  }
  expect(output.eventType).toBe('test');
  expect(output.id).toBe('123');
  expect(output.data).toBe('hello');
});

test('flush handles remaining buffer', async () => {
  const [output] = await processChunks(['data: incomplete']);
  if (output === undefined) {
    expect(output).toBeDefined();
    return;
  }
  expect(output.data).toBe('incomplete');
});
