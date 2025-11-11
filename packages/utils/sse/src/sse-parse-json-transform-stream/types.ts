import type { JSONTransformStreamOutput } from '@jearle/util-stream';

import { type SSEParseTransformStreamOutput } from '../sse-parse-transform-stream';

export type SSEParseJSONTransformStreamInput = Pick<
  SSEParseTransformStreamOutput,
  `data` | `status`
>;

export type SSEParseJSONTransformStreamOutput = JSONTransformStreamOutput;
