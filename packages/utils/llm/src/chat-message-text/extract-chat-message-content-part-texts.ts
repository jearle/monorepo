import {
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
} from './constants';
import { extractChatMessageContentPartText } from './extract-chat-message-content-part-text';
import { handleEmptyChatMessageText } from './handle-empty-chat-message-text';
import { createChatMessageContentPartTextsErrorResult } from './errors';
import { type ParsedChatMessageContentParts } from './chat-messages-schema';
import {
  type ExtractChatMessageContentPartTextsResult,
  type ResolvedExtractChatMessageTextsOptions,
} from './types';

export type ExtractChatMessageContentPartTextsProps = {
  readonly chatMessageContentParts: ParsedChatMessageContentParts;
  readonly chatMessageIndex: number;
  readonly options: ResolvedExtractChatMessageTextsOptions;
};

export const extractChatMessageContentPartTexts = (
  props: ExtractChatMessageContentPartTextsProps,
): ExtractChatMessageContentPartTextsResult => {
  const { chatMessageContentParts, chatMessageIndex, options } = props;
  const chatMessageContentPartTextResults = chatMessageContentParts.map(
    (chatMessageContentPart, chatMessageContentPartIndex) => {
      const result = extractChatMessageContentPartText({
        chatMessageContentPart,
        chatMessageContentPartIndex,
        chatMessageIndex,
        options,
      });

      return result;
    },
  );
  const firstErrorResult = chatMessageContentPartTextResults.find(
    (chatMessageContentPartTextResult) => {
      const hasError =
        chatMessageContentPartTextResult.status ===
        EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR;

      return hasError;
    },
  );

  if (
    firstErrorResult !== undefined &&
    firstErrorResult.status === EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR
  ) {
    const result = createChatMessageContentPartTextsErrorResult(
      firstErrorResult.error,
    );

    return result;
  }

  const chatMessageContentPartTexts = chatMessageContentPartTextResults.flatMap(
    (chatMessageContentPartTextResult) => {
      if (
        chatMessageContentPartTextResult.status ===
        EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR
      ) {
        const result = [] as const;

        return result;
      }

      const { data: chatMessageText } = chatMessageContentPartTextResult;

      if (chatMessageText === null) {
        const result = [] as const;

        return result;
      }

      const result = [chatMessageText] as const;

      return result;
    },
  );
  const chatMessageText = chatMessageContentPartTexts.join(
    options.chatMessageContentPartTextSeparator,
  );
  const emptyResult =
    chatMessageText.length === 0
      ? handleEmptyChatMessageText({
          chatMessageIndex,
          options,
        })
      : ({
          data: chatMessageText,
          status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
        } as const);

  if (emptyResult.status === EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR) {
    const result = createChatMessageContentPartTextsErrorResult(
      emptyResult.error,
    );

    return result;
  }

  const data = {
    chatMessageContentPartTexts,
    chatMessageText: emptyResult.data,
  };
  const result: ExtractChatMessageContentPartTextsResult = {
    data,
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
  };

  return result;
};
