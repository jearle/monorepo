import {
  createSSEString,
  SSE_FIELD_NAME_DATA,
  SSE_FIELD_VALUE_DONE,
} from '../sse-string';

import type {
  SSEStringifyTransformStreamInput,
  SSEStringifyTransformStreamOutput,
} from './types';

export const createSSEStringifyTransformStream = () => {
  const sseStringifyTransformStream = new TransformStream<
    SSEStringifyTransformStreamInput,
    SSEStringifyTransformStreamOutput
  >({
    transform(chunk, controller) {
      if (chunk === SSE_FIELD_VALUE_DONE) {
        const sseString = createSSEString(SSE_FIELD_VALUE_DONE);

        controller.enqueue(sseString);
        controller.terminate();
        return;
      }
      const sseString = createSSEString(chunk);
      controller.enqueue(sseString);
    },
    flush(controller) {
      const sseString = `${SSE_FIELD_NAME_DATA}: ${SSE_FIELD_VALUE_DONE}\n\n`;
      controller.enqueue(sseString);
    },
  });

  const result = { sseStringifyTransformStream };

  return result;
};
