import { EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS } from './constants';
import { extractArrayChatMessageText } from './extract-array-chat-message-text';
import { extractNullChatMessageText } from './extract-null-chat-message-text';
import { extractStringChatMessageText } from './extract-string-chat-message-text';
import { type ParsedChatMessage } from './chat-messages-schema';
import {
  type ExtractChatMessageTextResult,
  type ResolvedExtractChatMessageTextsOptions,
} from './types';
import { type MessageRole } from '@jearle/schema-conversation';

const checkShouldExtractChatMessage = (
  options: ResolvedExtractChatMessageTextsOptions,
  chatMessageRole: MessageRole,
) => {
  const result = options.chatMessageRoles.includes(chatMessageRole);

  return result;
};

export type ExtractChatMessageTextProps = {
  readonly chatMessage: ParsedChatMessage;
  readonly chatMessageIndex: number;
  readonly options: ResolvedExtractChatMessageTextsOptions;
};

export const extractChatMessageText = (
  props: ExtractChatMessageTextProps,
): ExtractChatMessageTextResult => {
  const { chatMessage, chatMessageIndex, options } = props;
  const { content: chatMessageContent, role: chatMessageRole } = chatMessage;
  const shouldExtractChatMessage = checkShouldExtractChatMessage(
    options,
    chatMessageRole,
  );

  if (shouldExtractChatMessage === false) {
    const data = null;
    const result: ExtractChatMessageTextResult = {
      data,
      status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
    };

    return result;
  }

  if (chatMessageContent === null) {
    const result = extractNullChatMessageText({
      chatMessageIndex,
      chatMessageRole,
      options,
    });

    return result;
  }

  if (typeof chatMessageContent === `string`) {
    const result = extractStringChatMessageText({
      chatMessageContent,
      chatMessageIndex,
      chatMessageRole,
      options,
    });

    return result;
  }

  const result = extractArrayChatMessageText({
    chatMessageContent,
    chatMessageIndex,
    chatMessageRole,
    options,
  });

  return result;
};
