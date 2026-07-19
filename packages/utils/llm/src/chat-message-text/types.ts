import { type MessageRole } from '@jearle/schema-conversation';

import {
  type CHAT_MESSAGE_CONTENT_PART_UNSUPPORTED_ACTIONS,
  type CHAT_MESSAGE_TEXT_EMPTY_ACTIONS,
  type EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  type EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
} from './constants';
import { type CHAT_MESSAGE_TEXT_ERROR_CODES } from './errors';

export type ChatMessageTextEmptyAction =
  (typeof CHAT_MESSAGE_TEXT_EMPTY_ACTIONS)[number];

export type ChatMessageContentPartUnsupportedAction =
  (typeof CHAT_MESSAGE_CONTENT_PART_UNSUPPORTED_ACTIONS)[number];

export type ChatMessageTextErrorCode =
  (typeof CHAT_MESSAGE_TEXT_ERROR_CODES)[number];

export type ChatMessageTextError = {
  readonly chatMessageContentPartIndex: number | null;
  readonly chatMessageIndex: number | null;
  readonly code: ChatMessageTextErrorCode;
  readonly message: string;
};

export type ChatMessageText = {
  readonly chatMessageContentPartTexts: readonly string[];
  readonly chatMessageIndex: number;
  readonly chatMessageRole: MessageRole;
  readonly chatMessageText: string;
};

export type ExtractChatMessageTextsData = {
  readonly chatMessageTexts: readonly ChatMessageText[];
  readonly combinedChatMessageText: string;
};

export type ExtractChatMessageTextsOptions = {
  readonly chatMessageContentPartTextSeparator?: string;
  readonly chatMessageRoles?: readonly MessageRole[];
  readonly chatMessageTextSeparator?: string;
  readonly emptyChatMessageText?: ChatMessageTextEmptyAction;
  readonly unsupportedChatMessageContentPart?: ChatMessageContentPartUnsupportedAction;
};

export type ResolvedExtractChatMessageTextsOptions =
  Required<ExtractChatMessageTextsOptions>;

export type ExtractChatMessageTextSuccessResult = {
  readonly status: typeof EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS;
  readonly data: ChatMessageText | null;
};

export type ExtractChatMessageTextErrorResult = {
  readonly status: typeof EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR;
  readonly error: ChatMessageTextError;
};

export type ExtractChatMessageTextResult =
  | ExtractChatMessageTextErrorResult
  | ExtractChatMessageTextSuccessResult;

export type ExtractChatMessageRawTextSuccessResult = {
  readonly status: typeof EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS;
  readonly data: string | null;
};

export type ExtractChatMessageRawTextErrorResult = {
  readonly status: typeof EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR;
  readonly error: ChatMessageTextError;
};

export type ExtractChatMessageRawTextResult =
  | ExtractChatMessageRawTextErrorResult
  | ExtractChatMessageRawTextSuccessResult;

export type ExtractChatMessageContentPartTextsData = {
  readonly chatMessageContentPartTexts: readonly string[];
  readonly chatMessageText: string | null;
};

export type ExtractChatMessageContentPartTextsSuccessResult = {
  readonly status: typeof EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS;
  readonly data: ExtractChatMessageContentPartTextsData;
};

export type ExtractChatMessageContentPartTextsErrorResult = {
  readonly status: typeof EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR;
  readonly error: ChatMessageTextError;
};

export type ExtractChatMessageContentPartTextsResult =
  | ExtractChatMessageContentPartTextsErrorResult
  | ExtractChatMessageContentPartTextsSuccessResult;

export type ExtractChatMessageTextsSuccessResult = {
  readonly data: ExtractChatMessageTextsData;
  readonly status: typeof EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS;
};

export type ExtractChatMessageTextsErrorResult = {
  readonly error: ChatMessageTextError;
  readonly status: typeof EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR;
};

export type ExtractChatMessageTextsResult =
  | ExtractChatMessageTextsErrorResult
  | ExtractChatMessageTextsSuccessResult;
