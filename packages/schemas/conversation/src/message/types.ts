import { type z } from 'zod';

import { type ExactPartial } from '@jearle/util-types';

import {
  type MessageBaseSchema,
  type MessageContentSchema,
  type MessageCreateSchema,
  type MessageEntityCreateSchema,
  type MessageEntitySchema,
  type MessageEntityUpdateSchema,
  type MessageProjectIdSchema,
  type MessageRoleSchema,
  type MessageSchema,
  type MessageSessionIdSchema,
  type MessageSuccessResponseSchema,
  type MessageUpdateSchema,
  type MessagesReadByQuerySchema,
  type MessagesReadBySchema,
  type MessagesSuccessResponseSchema,
} from './schemas';

export type MessageRole = z.infer<typeof MessageRoleSchema>;

export type MessageProjectId = z.infer<typeof MessageProjectIdSchema>;
export type MessageSessionId = z.infer<typeof MessageSessionIdSchema>;
export type MessageContent = z.infer<typeof MessageContentSchema>;
export type MessageBase = z.infer<typeof MessageBaseSchema>;

export type MessageEntity = z.infer<typeof MessageEntitySchema>;
export type MessageEntityCreate = z.infer<typeof MessageEntityCreateSchema>;
export type MessageEntityUpdate = z.infer<typeof MessageEntityUpdateSchema>;

export type Message = z.infer<typeof MessageSchema>;
export type MessageCreate = z.infer<typeof MessageCreateSchema>;
export type MessageUpdate = z.infer<typeof MessageUpdateSchema>;
export type MessagesReadBy = ExactPartial<z.infer<typeof MessagesReadBySchema>>;
export type MessagesReadByQuery = z.infer<typeof MessagesReadByQuerySchema>;

export type MessageSuccessResponse = z.infer<
  typeof MessageSuccessResponseSchema
>;
export type MessagesSuccessResponse = z.infer<
  typeof MessagesSuccessResponseSchema
>;
