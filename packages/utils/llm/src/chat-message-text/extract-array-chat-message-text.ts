import {
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
} from './constants';
import { createChatMessageText } from './create-chat-message-text';
import { extractChatMessageContentPartTexts } from './extract-chat-message-content-part-texts';
import { createChatMessageTextErrorResult } from './errors';
import { type ParsedChatMessageContentParts } from './chat-messages-schema';
import {
  type ExtractChatMessageTextResult,
  type ResolvedExtractChatMessageTextsOptions,
} from './types';
import { type MessageRole } from '@jearle/schema-conversation';

export type ExtractArrayChatMessageTextProps = {
  readonly chatMessageContent: ParsedChatMessageContentParts;
  readonly chatMessageIndex: number;
  readonly chatMessageRole: MessageRole;
  readonly options: ResolvedExtractChatMessageTextsOptions;
};

export const extractArrayChatMessageText = (
  props: ExtractArrayChatMessageTextProps,
): ExtractChatMessageTextResult => {
  const { chatMessageContent, chatMessageIndex, chatMessageRole, options } =
    props;
  const contentPartTextsResult = extractChatMessageContentPartTexts({
    chatMessageContentParts: chatMessageContent,
    chatMessageIndex,
    options,
  });

  if (
    contentPartTextsResult.status === EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR
  ) {
    const result = createChatMessageTextErrorResult(
      contentPartTextsResult.error,
    );

    return result;
  }

  if (contentPartTextsResult.data.chatMessageText === null) {
    const data = null;
    const result: ExtractChatMessageTextResult = {
      data,
      status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
    };

    return result;
  }

  const chatMessageText = createChatMessageText({
    chatMessageContentPartTexts:
      contentPartTextsResult.data.chatMessageContentPartTexts,
    chatMessageIndex,
    chatMessageRole,
    chatMessageText: contentPartTextsResult.data.chatMessageText,
  });
  const result: ExtractChatMessageTextResult = {
    data: chatMessageText,
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
  };

  return result;
};
