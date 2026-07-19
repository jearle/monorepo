import { MESSAGE_ROLES } from '@jearle/schema-conversation';

import {
  CHAT_MESSAGE_CONTENT_PART_TEXT_SEPARATOR,
  CHAT_MESSAGE_CONTENT_PART_UNSUPPORTED_ACTION_ERROR,
  CHAT_MESSAGE_TEXT_EMPTY_ACTION_OMIT,
  CHAT_MESSAGE_TEXT_SEPARATOR,
} from './constants';
import {
  type ExtractChatMessageTextsOptions,
  type ResolvedExtractChatMessageTextsOptions,
} from './types';

export const createChatMessageTextOptions = (
  options: ExtractChatMessageTextsOptions,
) => {
  const {
    chatMessageContentPartTextSeparator = CHAT_MESSAGE_CONTENT_PART_TEXT_SEPARATOR,
    chatMessageRoles = MESSAGE_ROLES,
    chatMessageTextSeparator = CHAT_MESSAGE_TEXT_SEPARATOR,
    emptyChatMessageText = CHAT_MESSAGE_TEXT_EMPTY_ACTION_OMIT,
    unsupportedChatMessageContentPart = CHAT_MESSAGE_CONTENT_PART_UNSUPPORTED_ACTION_ERROR,
  } = options;
  const result: ResolvedExtractChatMessageTextsOptions = {
    chatMessageContentPartTextSeparator,
    chatMessageRoles,
    chatMessageTextSeparator,
    emptyChatMessageText,
    unsupportedChatMessageContentPart,
  };

  return result;
};
