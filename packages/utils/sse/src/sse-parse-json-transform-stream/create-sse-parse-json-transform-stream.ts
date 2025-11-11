import {
  createSafeParseJSONTransformStream,
  chainTransformStreams,
} from '@jearle/util-stream';

import { SSE_TRANSFORM_STREAM_STATUS_DONE } from '../sse-parse-transform-stream';

import type {
  SSEParseJSONTransformStreamInput,
  SSEParseJSONTransformStreamOutput,
} from './types';

export const createSSEParseJSONTransformStream = <T = unknown>() => {
  const { safeParseJSONTransformStream } =
    createSafeParseJSONTransformStream<T>();

  const transformStream = new TransformStream<
    SSEParseJSONTransformStreamInput,
    SSEParseJSONTransformStreamOutput
  >({
    transform(chunk, controller) {
      const { data, status } = chunk;

      if (status === SSE_TRANSFORM_STREAM_STATUS_DONE) {
        return;
      }

      const output: SSEParseJSONTransformStreamOutput = {
        success: true,
        data,
      };
      controller.enqueue(output);
    },
  });
  const sseParseJSONTransformStream = chainTransformStreams(
    transformStream,
    safeParseJSONTransformStream,
  );

  const result = { sseParseJSONTransformStream };

  return result;
};
