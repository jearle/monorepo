import { z } from 'zod';

import {
  EntityAtSchema,
  EntityIdSchema,
  EntityMetadataSchema,
} from '@jearle/schema-entity';
import {
  PaginationQuerySchema,
  SuccessResponseDataSchema,
  SuccessResponseSchema,
} from '@jearle/schema-api';

import { MESSAGE_ROLES } from './constants';

export const MessageRoleSchema = z.literal(MESSAGE_ROLES);

export const MessageProjectIdSchema = z.object({
  projectId: z.uuid(),
});

export const MessageSessionIdSchema = z.object({
  sessionId: z.uuid(),
});

export const MessageContentSchema = z.object({
  content: z.string().nullable(),
});

export const MessageBaseSchema = z.object({
  role: MessageRoleSchema,
  ...MessageContentSchema.shape,
});

export const MessageEntitySchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityAtSchema.shape,
  ...EntityMetadataSchema.shape,
  ...MessageProjectIdSchema.shape,
  ...MessageSessionIdSchema.shape,
  ...MessageBaseSchema.shape,
});

export const MessageEntityCreateSchema = z.object({
  ...EntityMetadataSchema.shape,
  ...MessageProjectIdSchema.shape,
  ...MessageSessionIdSchema.shape,
  ...MessageBaseSchema.shape,
});

export const MessageEntityUpdateSchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityMetadataSchema.partial().shape,
});

export const MessageSchema = MessageEntitySchema;

export const MessageCreateSchema = z.object({
  ...EntityMetadataSchema.shape,
  ...MessageProjectIdSchema.shape,
  ...MessageSessionIdSchema.shape,
  ...MessageBaseSchema.shape,
});

export const MessageUpdateSchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityMetadataSchema.partial().shape,
});

export const MessagesReadBySchema = z
  .object({
    ...EntityIdSchema.shape,
    ...EntityMetadataSchema.shape,
    ...MessageProjectIdSchema.shape,
    ...MessageSessionIdSchema.shape,
    ...MessageBaseSchema.shape,
  })
  .partial();

export const MessagesReadByQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  ...MessagesReadBySchema.shape,
});

export const MessageSuccessResponseDataSchema = z.object({
  ...SuccessResponseDataSchema.shape,
  message: MessageSchema,
});

export const MessageSuccessResponseSchema = z.object({
  ...SuccessResponseSchema.shape,
  data: MessageSuccessResponseDataSchema,
});

export const MessagesSuccessResponseDataSchema = z.object({
  ...SuccessResponseDataSchema.shape,
  messages: z.array(MessageSchema),
});

export const MessagesSuccessResponseSchema = z.object({
  ...SuccessResponseSchema.shape,
  data: MessagesSuccessResponseDataSchema,
});
