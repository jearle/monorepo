import z from 'zod';

import type {
  OpenAIParseCompletionChunkTransformStreamInput,
  OpenAIParseCompletionChunkTransformStreamOutput,
} from './types';
import { OpenAICompletionChunkSchema } from './open-ai-completion-chunk-schema';

export const createOpenAIParseCompletionChunkTransformStream = () => {
  const openAIParseCompletionChunkTransformStream = new TransformStream<
    OpenAIParseCompletionChunkTransformStreamInput,
    OpenAIParseCompletionChunkTransformStreamOutput
  >({
    transform(jsonParseResult, controller) {
      if (jsonParseResult.success === false) {
        const { error } = jsonParseResult;

        const data = {
          content: error.message,
        };
        const output = {
          data,
        };

        controller.enqueue(output);
        return;
      }

      const { data: parsedLineJSON } = jsonParseResult;

      const safeParseResult =
        OpenAICompletionChunkSchema.safeParse(parsedLineJSON);

      if (safeParseResult.success === false) {
        const errorTree = z.treeifyError(safeParseResult.error);
        const errorMessage = `Invalid openrouter api response:\n ${errorTree}`;

        const data = {
          content: errorMessage,
        };
        const output = {
          data,
        };

        controller.enqueue(output);
        return;
      }

      const { data: completion } = safeParseResult;

      const [choice1] = completion.choices;

      if (choice1 === undefined) {
        const data = {
          content: `No chat completion choice was given.`,
        };

        const output = {
          data,
        };

        controller.enqueue(output);
        return;
      }

      const { content } = choice1.delta;
      const data = { content };

      const result = { error: null, data };

      controller.enqueue(result);
    },
  });

  const result = { openAIParseCompletionChunkTransformStream };

  return result;
};
