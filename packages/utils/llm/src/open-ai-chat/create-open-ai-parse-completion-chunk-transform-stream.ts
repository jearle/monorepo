import z from 'zod';

import {
  type OpenAIParseCompletionChunkTransformStreamInput,
  type OpenAIParseCompletionChunkTransformStreamOutput,
} from './types';
import { OpenAICompletionChunkSchema } from './open-ai-completion-chunk-schema';

/**
 * Creates a transform stream that validates and normalizes streamed completion chunks.
 *
 * @returns A transform stream wrapper for OpenAI-compatible completion chunks.
 *
 * @example
 * const { openAIParseCompletionChunkTransformStream } =
 *   createOpenAIParseCompletionChunkTransformStream();
 */
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
        const { error } = safeParseResult;
        const prettifiedError = z.prettifyError(error);
        const responseBody = JSON.stringify(parsedLineJSON, null, 2);
        const errorParts = [
          `Invalid openrouter api response.`,
          prettifiedError,
          `Response body:`,
          responseBody,
        ];
        const errorMessage = errorParts.join(`\n`);

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
        return;
      }

      const { error } = choice1;
      const hasError = error === undefined;

      if (hasError === false) {
        const { message } = error;
        const data = { content: message };
        const output = { data };

        controller.enqueue(output);
        return;
      }

      const { delta } = choice1;
      const { content } = delta;

      if (content === undefined) {
        return;
      }

      if (content === null) {
        return;
      }

      const data = { content };

      const result = { data };

      controller.enqueue(result);
    },
  });

  const result = { openAIParseCompletionChunkTransformStream };

  return result;
};
