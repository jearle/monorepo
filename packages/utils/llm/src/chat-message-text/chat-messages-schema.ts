import { z } from 'zod';

import { MessageRoleSchema } from '@jearle/schema-conversation';

const ChatMessageContentPartSchema = z
  .object({
    type: z.string().trim().min(1),
  })
  .catchall(z.unknown());

const ChatMessageContentSchema = z.union([
  z.string(),
  z.null(),
  z.array(ChatMessageContentPartSchema),
]);

const ChatMessageSchema = z
  .object({
    content: ChatMessageContentSchema,
    role: MessageRoleSchema,
  })
  .catchall(z.unknown());

export const ChatMessagesSchema = z.array(ChatMessageSchema);

export type ParsedChatMessages = z.infer<typeof ChatMessagesSchema>;
export type ParsedChatMessage = ParsedChatMessages[number];
export type ParsedChatMessageContent = ParsedChatMessage[`content`];
export type ParsedChatMessageContentParts = Extract<
  ParsedChatMessageContent,
  readonly unknown[]
>;
export type ParsedChatMessageContentPart =
  ParsedChatMessageContentParts[number];
