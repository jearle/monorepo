import type { SSE_FIELD_VALUE_DONE } from '../sse-string';

export type SSEStringifyTransformStreamInput =
  | string
  | typeof SSE_FIELD_VALUE_DONE;
export type SSEStringifyTransformStreamOutput = string;
