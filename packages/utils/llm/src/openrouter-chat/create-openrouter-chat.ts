import z from 'zod';

import {
  createSSEParseJSONTransformStream,
  createSSEParseTransformStream,
  createSSEStringifyJSONTransformStream,
  createSSEStringifyTransformStream,
} from '@jearle/util-sse';

import {
  OpenAICompletionSchema,
  createOpenAIParseCompletionChunkTransformStream,
} from '../open-ai-chat';

import { fetchOpenrouterChatCompletions } from './fetch-openrouter-chat-completions';
import {
  type ChatCompletionResult,
  type ChatCompletionStreamResult,
  type Message,
  OPENROUTER_CHAT_RESULT_STATUS_ERROR,
  OPENROUTER_CHAT_RESULT_STATUS_SUCCESS,
} from './types';

export type CreateOpenrouterChatProps = {
  readonly api: string;
  readonly apiKey: string;
  readonly model: string;
};

/**
 * Creates an OpenRouter chat adapter for request-response and streaming calls.
 *
 * @param props - The OpenRouter chat configuration.
 * @returns A chat adapter with completion helpers.
 *
 * @example
 * const { chat } = createOpenrouterChat({
 *   api: `https://openrouter.ai/api/v1/chat/completions`,
 *   apiKey: `test-key`,
 *   model: `openai/gpt-4o-mini`,
 * });
 */
export const createOpenrouterChat = (props: CreateOpenrouterChatProps) => {
  const { api, apiKey, model } = props;

  type CompletionsProps = Message;

  const completions = async (
    props: CompletionsProps,
  ): Promise<ChatCompletionResult> => {
    const { system, user } = props;
    const request = {
      api,
      apiKey,
      model,
      stream: false,
      system,
      user,
    };
    const { response } = await fetchOpenrouterChatCompletions(request);

    const json: unknown = await response.json();
    const responseStatus = response.status;
    const responseOK = response.ok;
    const responseBody = JSON.stringify(json, null, 2);

    if (responseOK === false) {
      const errorParts = [
        `Openrouter chat request failed with status ${responseStatus}.`,
        `Response body:`,
        responseBody,
      ];
      const errorMessage = errorParts.join(`\n`);

      const result = {
        status: OPENROUTER_CHAT_RESULT_STATUS_ERROR,
        error: errorMessage,
      };

      return result;
    }

    const parsedJSON = OpenAICompletionSchema.safeParse(json);

    const { success } = parsedJSON;

    if (success === false) {
      const { error } = parsedJSON;

      const prettifiedError = z.prettifyError(error);
      const errorParts = [
        `Invalid openrouter api response.`,
        prettifiedError,
        `Response body:`,
        responseBody,
      ];
      const errorMessage = errorParts.join(`\n`);

      const result = {
        status: OPENROUTER_CHAT_RESULT_STATUS_ERROR,
        error: errorMessage,
      };

      return result;
    }

    const { data: openAIChatCompletion } = parsedJSON;

    const [firstChoice] = openAIChatCompletion.choices;

    if (firstChoice === undefined) {
      const result = {
        status: OPENROUTER_CHAT_RESULT_STATUS_ERROR,
        error: `first choice is undefined`,
      };

      return result;
    }

    const { error } = firstChoice;
    const hasError = error === undefined;

    if (hasError === false) {
      const { message } = error;
      const result = {
        status: OPENROUTER_CHAT_RESULT_STATUS_ERROR,
        error: message,
      };

      return result;
    }

    const { message } = firstChoice;
    const { content } = message;

    if (content === null) {
      const result = {
        status: OPENROUTER_CHAT_RESULT_STATUS_ERROR,
        error: `chat completion content is null`,
      };

      return result;
    }

    const result = {
      status: OPENROUTER_CHAT_RESULT_STATUS_SUCCESS,
      data: {
        content,
      },
    };

    return result;
  };

  type CompletionsStreamProps = Message;

  const completionsStream = async (
    props: CompletionsStreamProps,
  ): Promise<ChatCompletionStreamResult> => {
    const { system, user } = props;
    const request = {
      api,
      apiKey,
      model,
      stream: true,
      system,
      user,
    };
    const { response } = await fetchOpenrouterChatCompletions(request);
    const responseStatus = response.status;
    const responseOK = response.ok;

    if (responseOK === false) {
      const json: unknown = await response.json();
      const responseBody = JSON.stringify(json, null, 2);
      const errorParts = [
        `Openrouter streaming request failed with status ${responseStatus}.`,
        `Response body:`,
        responseBody,
      ];
      const errorMessage = errorParts.join(`\n`);

      const result = {
        status: OPENROUTER_CHAT_RESULT_STATUS_ERROR,
        error: errorMessage,
      };

      return result;
    }

    const { body: responseBody } = response;

    if (responseBody === null) {
      const result = {
        status: OPENROUTER_CHAT_RESULT_STATUS_ERROR,
        error: `no response body`,
      };

      return result;
    }

    const { openAIParseCompletionChunkTransformStream } =
      createOpenAIParseCompletionChunkTransformStream();
    const { sseParseTransformStream } = createSSEParseTransformStream();
    const { sseParseJSONTransformStream } = createSSEParseJSONTransformStream();

    const { sseStringifyJSONTransformStream } =
      createSSEStringifyJSONTransformStream();
    const { sseStringifyTransformStream } = createSSEStringifyTransformStream();

    const parsedSSEStream = responseBody.pipeThrough(sseParseTransformStream);
    const parsedJSONStream = parsedSSEStream.pipeThrough(
      sseParseJSONTransformStream,
    );
    const parsedCompletionStream = parsedJSONStream.pipeThrough(
      openAIParseCompletionChunkTransformStream,
    );
    const stringifiedJSONStream = parsedCompletionStream.pipeThrough(
      sseStringifyJSONTransformStream,
    );
    const stream = stringifiedJSONStream.pipeThrough(
      sseStringifyTransformStream,
    );

    const result = {
      status: OPENROUTER_CHAT_RESULT_STATUS_SUCCESS,
      data: {
        stream,
      },
    };

    return result;
  };

  const chat = {
    completions,
    completionsStream,
  };

  const result = { chat };

  return result;
};

export type OpenRouterChat = ReturnType<typeof createOpenrouterChat>[`chat`];
