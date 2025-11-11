import z from 'zod';

import {
  createSSEParseTransformStream,
  createSSEParseJSONTransformStream,
  createSSEStringifyJSONTransformStream,
  createSSEStringifyTransformStream,
} from '@jearle/util-sse';

import {
  OpenAICompletionSchema,
  createOpenAIParseCompletionChunkTransformStream,
} from '../open-ai-chat';

import { fetchOpenrouterChatCompletions } from './fetch-openrouter-chat-completions';
import type { Message } from './types';

type PropsCreateChat = {
  readonly api: string;
  readonly apiKey: string;
  readonly model: string;
};
export const createOpenrouterChat = (props: PropsCreateChat) => {
  const { api, apiKey, model } = props;

  type PropsCompletions = Message;
  const completions = async (props: PropsCompletions) => {
    const { response } = await fetchOpenrouterChatCompletions({
      api,
      apiKey,
      model,
      stream: false,
      ...props,
    });

    const json = await response.json();

    const parsedJSON = OpenAICompletionSchema.safeParse(json);

    const { success } = parsedJSON;

    if (success === false) {
      const { error } = parsedJSON;

      const errorTree = z.treeifyError(error);
      const errorMessage = `Invalid openrouter api response:\n ${errorTree}`;

      const result = {
        error: errorMessage,
        content: null,
      };

      return result;
    }

    const { data: openAIChatCompletion } = parsedJSON;

    const [firstChoice] = openAIChatCompletion.choices;

    if (firstChoice === undefined) {
      const result = {
        error: `first choice is undefined`,
        content: null,
      };

      return result;
    }

    const { content } = firstChoice.message;

    const result = {
      error: null,
      content,
    };

    return result;
  };

  type PropsCompletionsStream = Message;
  const completionsStream = async (props: PropsCompletionsStream) => {
    const { response } = await fetchOpenrouterChatCompletions({
      api,
      apiKey,
      model,
      stream: true,
      ...props,
    });

    const { body: responseBody } = response;

    if (responseBody === null) {
      const result = {
        error: `no response body`,
        stream: null,
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

    const stream = responseBody
      .pipeThrough(sseParseTransformStream)
      .pipeThrough(sseParseJSONTransformStream)
      .pipeThrough(openAIParseCompletionChunkTransformStream)
      .pipeThrough(sseStringifyJSONTransformStream)
      .pipeThrough(sseStringifyTransformStream);

    const result = { error: null, stream };

    return result;
  };

  const chat = {
    completions,
    completionsStream,
  };

  const result = { chat };

  return result;
};
