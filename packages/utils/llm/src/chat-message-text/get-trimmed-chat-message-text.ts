import { EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS } from './constants';
import { handleEmptyChatMessageText } from './handle-empty-chat-message-text';
import {
  type ExtractChatMessageRawTextResult,
  type ResolvedExtractChatMessageTextsOptions,
} from './types';

export type GetTrimmedChatMessageTextProps = {
  readonly chatMessageIndex: number;
  readonly options: ResolvedExtractChatMessageTextsOptions;
  readonly text: string;
};

export const getTrimmedChatMessageText = (
  props: GetTrimmedChatMessageTextProps,
): ExtractChatMessageRawTextResult => {
  const { chatMessageIndex, options, text } = props;
  const trimmedText = text.trim();

  if (trimmedText.length === 0) {
    const result = handleEmptyChatMessageText({
      chatMessageIndex,
      options,
    });

    return result;
  }

  const result: ExtractChatMessageRawTextResult = {
    data: trimmedText,
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
  };

  return result;
};
