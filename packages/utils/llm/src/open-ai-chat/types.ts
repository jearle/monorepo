import { z } from 'zod';

import type { JSONTransformStreamOutput } from '@jearle/util-stream';

import type { Completion } from '../chat';

import type { OpenAICompletionSchema } from './open-ai-completion-schema';
import type { OpenAICompletionChunkSchema } from './open-ai-completion-chunk-schema';

export type OpenAICompletion = z.infer<typeof OpenAICompletionSchema>;

export type OpenAICompletionChunk = z.infer<typeof OpenAICompletionChunkSchema>;

export type OpenAIParseCompletionChunkTransformStreamInput =
  JSONTransformStreamOutput;

export type OpenAIParseCompletionChunkTransformStreamOutput = {
  readonly data: Completion;
};
