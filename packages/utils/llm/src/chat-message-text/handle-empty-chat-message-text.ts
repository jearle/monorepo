import {
  CHAT_MESSAGE_TEXT_EMPTY_ACTION_ERROR,
  CHAT_MESSAGE_TEXT_EMPTY_ACTION_OMIT,
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
} from './constants';
import {
  CHAT_MESSAGE_TEXT_ERROR_CODE_EMPTY_CHAT_MESSAGE_TEXT,
  EMPTY_CHAT_MESSAGE_TEXT_ERROR,
  createChatMessageRawTextErrorResult,
  createChatMessageTextError,
} from './errors';
import {
  type ExtractChatMessageRawTextResult,
  type ResolvedExtractChatMessageTextsOptions,
} from './types';

export type HandleEmptyChatMessageTextProps = {
  readonly chatMessageIndex: number;
  readonly options: ResolvedExtractChatMessageTextsOptions;
};

export const handleEmptyChatMessageText = (
  props: HandleEmptyChatMessageTextProps,
): ExtractChatMessageRawTextResult => {
  const { chatMessageIndex, options } = props;

  if (options.emptyChatMessageText === CHAT_MESSAGE_TEXT_EMPTY_ACTION_ERROR) {
    const error = createChatMessageTextError({
      chatMessageContentPartIndex: null,
      chatMessageIndex,
      code: CHAT_MESSAGE_TEXT_ERROR_CODE_EMPTY_CHAT_MESSAGE_TEXT,
      message: EMPTY_CHAT_MESSAGE_TEXT_ERROR,
    });
    const result = createChatMessageRawTextErrorResult(error);

    return result;
  }

  const chatMessageText =
    options.emptyChatMessageText === CHAT_MESSAGE_TEXT_EMPTY_ACTION_OMIT
      ? null
      : ``;
  const result: ExtractChatMessageRawTextResult = {
    data: chatMessageText,
    status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
  };

  return result;
};
