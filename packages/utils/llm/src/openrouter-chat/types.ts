import { type z } from 'zod';
import { MessageSchema } from './message-schema';

export const OPENROUTER_CHAT_RESULT_STATUS_SUCCESS = `SUCCESS` as const;
export const OPENROUTER_CHAT_RESULT_STATUS_ERROR = `ERROR` as const;
export const OPENROUTER_CHAT_RESULT_STATUSES = [
  OPENROUTER_CHAT_RESULT_STATUS_SUCCESS,
  OPENROUTER_CHAT_RESULT_STATUS_ERROR,
] as const;

export type Message = Readonly<z.infer<typeof MessageSchema>>;

export type ChatCompletionData = {
  readonly content: string;
};

export type ChatCompletionResultFailure = {
  readonly status: typeof OPENROUTER_CHAT_RESULT_STATUS_ERROR;
  readonly error: string;
};

export type ChatCompletionResultSuccess = {
  readonly status: typeof OPENROUTER_CHAT_RESULT_STATUS_SUCCESS;
  readonly data: ChatCompletionData;
};

export type ChatCompletionResult =
  | ChatCompletionResultFailure
  | ChatCompletionResultSuccess;

export type ChatCompletionStreamData = {
  readonly stream: ReadableStream<string>;
};

export type ChatCompletionStreamResultFailure = {
  readonly status: typeof OPENROUTER_CHAT_RESULT_STATUS_ERROR;
  readonly error: string;
};

export type ChatCompletionStreamResultSuccess = {
  readonly status: typeof OPENROUTER_CHAT_RESULT_STATUS_SUCCESS;
  readonly data: ChatCompletionStreamData;
};

export type ChatCompletionStreamResult =
  | ChatCompletionStreamResultFailure
  | ChatCompletionStreamResultSuccess;
