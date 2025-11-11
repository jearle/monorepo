import {
  createSafeStringifyJSONTransformStream,
  chainTransformStreams,
} from '@jearle/util-stream';

import type {
  SSEStringifyJSONTransformStreamInput,
  SSEStringifyJSONTransformStreamOutput,
} from './types';
import { SSE_FIELD_VALUE_DONE } from '../sse-string';

export const createSSEStringifyJSONTransformStream = () => {
  const { safeStringifyJSONTransformStream } =
    createSafeStringifyJSONTransformStream();

  const transformStream = new TransformStream<
    SSEStringifyJSONTransformStreamInput,
    SSEStringifyJSONTransformStreamOutput
  >({
    transform(chunk, controller) {
      const { success } = chunk;
      if (!success) {
        const { message: error } = chunk.error;
        const errorChunk = JSON.stringify({ error });

        controller.enqueue(errorChunk);
        return;
      }

      const { data } = chunk;

      controller.enqueue(data);
    },
    flush(controller) {
      controller.enqueue(SSE_FIELD_VALUE_DONE);
    },
  });

  const sseStringifyJSONTransformStream = chainTransformStreams(
    safeStringifyJSONTransformStream,
    transformStream,
  );

  const result = { sseStringifyJSONTransformStream };

  return result;
};
