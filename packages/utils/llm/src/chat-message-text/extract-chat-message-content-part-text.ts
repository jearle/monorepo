import {
  CHAT_MESSAGE_CONTENT_PART_TYPE_TEXT,
  CHAT_MESSAGE_CONTENT_PART_UNSUPPORTED_ACTION_ERROR,
  EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
} from './constants';
import {
  CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGE_CONTENT_PART,
  CHAT_MESSAGE_TEXT_ERROR_CODE_UNSUPPORTED_CHAT_MESSAGE_CONTENT_PART,
  MALFORMED_CHAT_MESSAGE_CONTENT_PART_ERROR,
  UNSUPPORTED_CHAT_MESSAGE_CONTENT_PART_ERROR,
  createChatMessageRawTextErrorResult,
  createChatMessageTextError,
} from './errors';
import { getTrimmedChatMessageText } from './get-trimmed-chat-message-text';
import { type ParsedChatMessageContentPart } from './chat-messages-schema';
import {
  type ExtractChatMessageRawTextResult,
  type ResolvedExtractChatMessageTextsOptions,
} from './types';

export type ExtractChatMessageContentPartTextProps = {
  readonly chatMessageContentPart: ParsedChatMessageContentPart;
  readonly chatMessageContentPartIndex: number;
  readonly chatMessageIndex: number;
  readonly options: ResolvedExtractChatMessageTextsOptions;
};

export const extractChatMessageContentPartText = (
  props: ExtractChatMessageContentPartTextProps,
): ExtractChatMessageRawTextResult => {
  const {
    chatMessageContentPart,
    chatMessageContentPartIndex,
    chatMessageIndex,
    options,
  } = props;
  const isTextChatMessageContentPart =
    chatMessageContentPart.type === CHAT_MESSAGE_CONTENT_PART_TYPE_TEXT;

  if (isTextChatMessageContentPart === false) {
    if (
      options.unsupportedChatMessageContentPart ===
      CHAT_MESSAGE_CONTENT_PART_UNSUPPORTED_ACTION_ERROR
    ) {
      const error = createChatMessageTextError({
        chatMessageContentPartIndex,
        chatMessageIndex,
        code: CHAT_MESSAGE_TEXT_ERROR_CODE_UNSUPPORTED_CHAT_MESSAGE_CONTENT_PART,
        message: UNSUPPORTED_CHAT_MESSAGE_CONTENT_PART_ERROR,
      });
      const result = createChatMessageRawTextErrorResult(error);

      return result;
    }

    const data = null;
    const result: ExtractChatMessageRawTextResult = {
      data,
      status: EXTRACT_CHAT_MESSAGE_TEXTS_STATUS_SUCCESS,
    };

    return result;
  }

  if (
    `text` in chatMessageContentPart === false ||
    typeof chatMessageContentPart[`text`] !== `string`
  ) {
    const error = createChatMessageTextError({
      chatMessageContentPartIndex,
      chatMessageIndex,
      code: CHAT_MESSAGE_TEXT_ERROR_CODE_MALFORMED_CHAT_MESSAGE_CONTENT_PART,
      message: MALFORMED_CHAT_MESSAGE_CONTENT_PART_ERROR,
    });
    const result = createChatMessageRawTextErrorResult(error);

    return result;
  }

  const result = getTrimmedChatMessageText({
    chatMessageIndex,
    options,
    text: chatMessageContentPart[`text`],
  });

  return result;
};
