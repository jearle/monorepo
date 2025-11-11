import type { SSE_TRANSFORM_STREAM_STATUSES } from './constants';

export type SSEParseTransformStreamStatus =
  (typeof SSE_TRANSFORM_STREAM_STATUSES)[number];

export type SSEParseTransformStreamInput = Uint8Array;

export type SSEParseTransformStreamOutput = {
  readonly data: string;
  readonly status: SSEParseTransformStreamStatus;
  readonly eventType: string;
  readonly id: string;
  readonly retry: string;
};
