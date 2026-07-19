import {
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR,
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
} from './constants';
import { createChatMessageText } from './create-chat-message-text';
import { createChatMessageTextErrorResult } from './errors';
import { getTrimmedChatMessageText } from './get-trimmed-chat-message-text';
import {
  type ExtractChatMessageTextResult,
  type ResolvedExtractChatMessageTextsOptions,
} from './types';
import { type MessageRole } from '@jearle/schema-conversation';

export type ExtractStringChatMessageTextProps = {
  readonly chatMessageContent: string;
  readonly chatMessageIndex: number;
  readonly chatMessageRole: MessageRole;
  readonly options: ResolvedExtractChatMessageTextsOptions;
};

export const extractStringChatMessageText = (
  props: ExtractStringChatMessageTextProps,
): ExtractChatMessageTextResult => {
  const { chatMessageContent, chatMessageIndex, chatMessageRole, options } =
    props;
  const rawTextResult = getTrimmedChatMessageText({
    chatMessageIndex,
    options,
    text: chatMessageContent,
  });

  if (rawTextResult.status === EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_ERROR) {
    const result = createChatMessageTextErrorResult(rawTextResult.error);

    return result;
  }

  if (rawTextResult.data === null) {
    const data = null;
    const result: ExtractChatMessageTextResult = {
      data,
      status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
    };

    return result;
  }

  const chatMessageText = createChatMessageText({
    chatMessageContentPartTexts: [],
    chatMessageIndex,
    chatMessageRole,
    chatMessageText: rawTextResult.data,
  });
  const result: ExtractChatMessageTextResult = {
    data: chatMessageText,
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
  };

  return result;
};
