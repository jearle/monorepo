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

import { TOOL_CALL_STATUSES } from './constants';

export const ToolCallStatusSchema = z.literal(TOOL_CALL_STATUSES);

export const ToolCallProjectIdSchema = z.object({
  projectId: z.uuid(),
});

export const ToolCallSessionIdSchema = z.object({
  sessionId: z.uuid(),
});

export const ToolCallMessageIdSchema = z.object({
  messageId: z.uuid(),
});

export const ToolCallNameSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export const ToolCallArgumentsSchema = z.object({
  arguments: z.record(z.string(), z.unknown()).nullable(),
});

export const ToolCallBaseSchema = z.object({
  status: ToolCallStatusSchema,
  ...ToolCallNameSchema.shape,
  ...ToolCallArgumentsSchema.shape,
});

export const ToolCallEntitySchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityAtSchema.shape,
  ...EntityMetadataSchema.shape,
  ...ToolCallProjectIdSchema.shape,
  ...ToolCallSessionIdSchema.shape,
  ...ToolCallMessageIdSchema.shape,
  ...ToolCallBaseSchema.shape,
});

export const ToolCallEntityCreateSchema = z.object({
  ...EntityMetadataSchema.shape,
  ...ToolCallProjectIdSchema.shape,
  ...ToolCallSessionIdSchema.shape,
  ...ToolCallMessageIdSchema.shape,
  ...ToolCallBaseSchema.shape,
});

export const ToolCallEntityUpdateSchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityMetadataSchema.partial().shape,
  ...ToolCallBaseSchema.partial().shape,
});

export const ToolCallSchema = ToolCallEntitySchema;

export const ToolCallCreateSchema = z.object({
  ...EntityMetadataSchema.shape,
  ...ToolCallProjectIdSchema.shape,
  ...ToolCallSessionIdSchema.shape,
  ...ToolCallMessageIdSchema.shape,
  ...ToolCallBaseSchema.shape,
});

export const ToolCallUpdateSchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityMetadataSchema.partial().shape,
  ...ToolCallBaseSchema.partial().shape,
});

export const ToolCallsReadBySchema = z
  .object({
    ...EntityIdSchema.shape,
    ...EntityMetadataSchema.shape,
    ...ToolCallProjectIdSchema.shape,
    ...ToolCallSessionIdSchema.shape,
    ...ToolCallMessageIdSchema.shape,
    ...ToolCallBaseSchema.shape,
  })
  .partial();

export const ToolCallsReadByQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  ...ToolCallsReadBySchema.shape,
});

export const ToolCallSuccessResponseDataSchema = z.object({
  ...SuccessResponseDataSchema.shape,
  toolCall: ToolCallSchema,
});

export const ToolCallSuccessResponseSchema = z.object({
  ...SuccessResponseSchema.shape,
  data: ToolCallSuccessResponseDataSchema,
});

export const ToolCallsSuccessResponseDataSchema = z.object({
  ...SuccessResponseDataSchema.shape,
  toolCalls: z.array(ToolCallSchema),
});

export const ToolCallsSuccessResponseSchema = z.object({
  ...SuccessResponseSchema.shape,
  data: ToolCallsSuccessResponseDataSchema,
});
