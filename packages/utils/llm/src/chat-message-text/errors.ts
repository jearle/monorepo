import { EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR } from './constants';
import {
  type ChatMessageTextError,
  type ExtractChatMessageContentPartTextsResult,
  type ExtractChatMessageRawTextResult,
  type ExtractChatMessageTextResult,
  type ExtractChatMessageTextsResult,
} from './types';

export const CHAT_MESSAGE_TEXT_ERROR_CODE_EMPTY_CHAT_MESSAGE_TEXT =
  `EMPTY_CHAT_MESSAGE_TEXT` as const;
export const CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGES =
  `MALFORMED_CHAT_MESSAGES` as const;
export const CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGE_CONTENT_PART =
  `MALFORMED_CHAT_MESSAGE_CONTENT_PART` as const;
export const CHAT_MESSAGE_TEXT_ERROR_CODE_UNSUPPORTED_CHAT_MESSAGE_CONTENT_PART =
  `UNSUPPORTED_CHAT_MESSAGE_CONTENT_PART` as const;

export const CHAT_MESSAGE_TEXT_ERROR_CODES = [
  CHAT_MESSAGE_TEXT_ERROR_CODE_EMPTY_CHAT_MESSAGE_TEXT,
  CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGES,
  CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGE_CONTENT_PART,
  CHAT_MESSAGE_TEXT_ERROR_CODE_UNSUPPORTED_CHAT_MESSAGE_CONTENT_PART,
] as const;

export const EMPTY_CHAT_MESSAGE_TEXT_ERROR =
  `chat message text must contain at least one non-whitespace character` as const;
export const MALFORMED_CHAT_MESSAGES_ERROR =
  `chatMessages must be an array of role-based chat messages` as const;
export const MALFORMED_CHAT_MESSAGE_CONTENT_PART_ERROR =
  `text chat message content parts must include string text` as const;
export const UNSUPPORTED_CHAT_MESSAGE_CONTENT_PART_ERROR =
  `chat message text extraction only supports text content parts` as const;

export type CreateChatMessageTextErrorProps = {
  readonly chatMessageContentPartIndex: number | null;
  readonly chatMessageIndex: number | null;
  readonly code: ChatMessageTextError[`code`];
  readonly message: string;
};

export const createChatMessageTextError = (
  props: CreateChatMessageTextErrorProps,
) => {
  const { chatMessageContentPartIndex, chatMessageIndex, code, message } =
    props;
  const result: ChatMessageTextError = {
    chatMessageContentPartIndex,
    chatMessageIndex,
    code,
    message,
  };

  return result;
};

export const createMalformedChatMessagesError = () => {
  const result = createChatMessageTextError({
    chatMessageContentPartIndex: null,
    chatMessageIndex: null,
    code: CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGES,
    message: MALFORMED_CHAT_MESSAGES_ERROR,
  });

  return result;
};

export const createExtractChatMessageTextsErrorResult = (
  error: ChatMessageTextError,
) => {
  const result: ExtractChatMessageTextsResult = {
    error,
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  };

  return result;
};

export const createChatMessageRawTextErrorResult = (
  error: ChatMessageTextError,
) => {
  const result: ExtractChatMessageRawTextResult = {
    error,
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  };

  return result;
};

export const createChatMessageContentPartTextsErrorResult = (
  error: ChatMessageTextError,
) => {
  const result: ExtractChatMessageContentPartTextsResult = {
    error,
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  };

  return result;
};

export const createChatMessageTextErrorResult = (
  error: ChatMessageTextError,
) => {
  const result: ExtractChatMessageTextResult = {
    error,
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  };

  return result;
};
