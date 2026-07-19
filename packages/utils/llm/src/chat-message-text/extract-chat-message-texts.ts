import {
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
} from './constants';
import { ChatMessagesSchema } from './chat-messages-schema';
import { createChatMessageTextOptions } from './create-chat-message-text-options';
import {
  createExtractChatMessageTextsErrorResult,
  createMalformedChatMessagesError,
} from './errors';
import { extractChatMessageText } from './extract-chat-message-text';
import {
  type ExtractChatMessageTextsOptions,
  type ExtractChatMessageTextsResult,
} from './types';

export type ExtractChatMessageTextsProps = {
  readonly chatMessages: unknown;
};

export const extractChatMessageTexts = (
  props: ExtractChatMessageTextsProps,
  options: ExtractChatMessageTextsOptions = {},
): ExtractChatMessageTextsResult => {
  const { chatMessages } = props;
  const resolvedOptions = createChatMessageTextOptions(options);
  const parsedChatMessages = ChatMessagesSchema.safeParse(chatMessages);

  if (parsedChatMessages.success === false) {
    const error = createMalformedChatMessagesError();
    const result = createExtractChatMessageTextsErrorResult(error);

    return result;
  }

  const chatMessageTextResults = parsedChatMessages.data.map(
    (chatMessage, chatMessageIndex) => {
      const result = extractChatMessageText({
        chatMessage,
        chatMessageIndex,
        options: resolvedOptions,
      });

      return result;
    },
  );
  const firstErrorResult = chatMessageTextResults.find(
    (chatMessageTextResult) => {
      const hasError =
        chatMessageTextResult.status ===
        EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR;

      return hasError;
    },
  );

  if (
    firstErrorResult !== undefined &&
    firstErrorResult.status === EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR
  ) {
    const result = createExtractChatMessageTextsErrorResult(
      firstErrorResult.error,
    );

    return result;
  }

  const chatMessageTexts = chatMessageTextResults.flatMap(
    (chatMessageTextResult) => {
      if (
        chatMessageTextResult.status === EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR
      ) {
        const result = [] as const;

        return result;
      }

      const { data } = chatMessageTextResult;

      if (data === null) {
        const result = [] as const;

        return result;
      }

      const result = [data] as const;

      return result;
    },
  );
  const chatMessageTextValues = chatMessageTexts.map((chatMessageText) => {
    const result = chatMessageText.chatMessageText;

    return result;
  });
  const combinedChatMessageText = chatMessageTextValues.join(
    resolvedOptions.chatMessageTextSeparator,
  );
  const data = {
    chatMessageTexts,
    combinedChatMessageText,
  };
  const result: ExtractChatMessageTextsResult = {
    data,
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
  };

  return result;
};
