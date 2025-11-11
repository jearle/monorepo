import {
  SSE_TRANSFORM_STREAM_STATUS_DATA,
  SSE_TRANSFORM_STREAM_STATUS_DONE,
} from './constants';
import type {
  SSEParseTransformStreamInput,
  SSEParseTransformStreamOutput,
} from './types';

const splitStringByNewLines = (string: string) => {
  const splitString = string.split(/\r?\n\r?\n/);

  return splitString;
};

const getMaybeValidString = (string: string) => {
  const trimmedString = string.trim();
  const isEmptyOrComment = !trimmedString || trimmedString.startsWith(':');

  if (isEmptyOrComment) {
    return null;
  }

  return trimmedString;
};

const getEventLines = (string: string) => {
  const eventLines = string.split(/\r?\n/);

  return eventLines;
};

const parseRemainingData = (buffer: string) => {
  const maybeValidString = getMaybeValidString(buffer);
  if (maybeValidString === null) {
    return null;
  }

  if (!maybeValidString.startsWith('data:')) {
    return null;
  }

  const data = maybeValidString.slice(5).trim();
  if (!data) {
    return null;
  }

  return {
    data,
    status: SSE_TRANSFORM_STREAM_STATUS_DATA,
    eventType: '',
    id: '',
    retry: '',
  } as const;
};
export const createSSEParseTransformStream = () => {
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  const sseParseTransformStream = new TransformStream<
    SSEParseTransformStreamInput,
    SSEParseTransformStreamOutput
  >({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });

      const lines = splitStringByNewLines(buffer);
      buffer = lines.pop() || '';

      for (const line of lines) {
        const maybeValidString = getMaybeValidString(line);

        if (maybeValidString === null) {
          continue;
        }

        const eventLines = getEventLines(maybeValidString);
        let eventType = '';
        let data = '';
        let id = '';
        let retry = '';

        for (const eventLine of eventLines) {
          if (eventLine.startsWith('event:')) {
            eventType = eventLine.slice(6).trim();
          } else if (eventLine.startsWith('data:')) {
            data += (data ? '\n' : '') + eventLine.slice(5);
          } else if (eventLine.startsWith('id:')) {
            id = eventLine.slice(3).trim();
          } else if (eventLine.startsWith('retry:')) {
            retry = eventLine.slice(6).trim();
          }
        }

        if (data === ``) {
          continue;
        }

        if (data.trim() === '[DONE]') {
          controller.enqueue({
            data: data.trim(),
            status: SSE_TRANSFORM_STREAM_STATUS_DONE,
            eventType,
            id,
            retry,
          });
          controller.terminate();
          return;
        }

        controller.enqueue({
          data: data.trim(),
          status: SSE_TRANSFORM_STREAM_STATUS_DATA,
          eventType,
          id,
          retry,
        });
      }
    },

    flush(controller) {
      const remainingData = parseRemainingData(buffer);

      if (remainingData === null) {
        return;
      }

      controller.enqueue(remainingData);
    },
  });

  const result = { sseParseTransformStream };
  return result;
};
