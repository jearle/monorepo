import { type MessageRole } from '@jearle/schema-conversation';

import { type ChatMessageText } from './types';

export type CreateChatMessageTextProps = {
  readonly chatMessageContentPartTexts: readonly string[];
  readonly chatMessageIndex: number;
  readonly chatMessageRole: MessageRole;
  readonly chatMessageText: string;
};

export const createChatMessageText = (props: CreateChatMessageTextProps) => {
  const {
    chatMessageContentPartTexts,
    chatMessageIndex,
    chatMessageRole,
    chatMessageText,
  } = props;
  const result: ChatMessageText = {
    chatMessageContentPartTexts,
    chatMessageIndex,
    chatMessageRole,
    chatMessageText,
  };

  return result;
};
