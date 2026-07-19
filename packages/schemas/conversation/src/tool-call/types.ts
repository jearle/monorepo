import { type z } from 'zod';

import { type ExactPartial } from '@jearle/util-types';

import {
  type ToolCallArgumentsSchema,
  type ToolCallBaseSchema,
  type ToolCallCreateSchema,
  type ToolCallEntityCreateSchema,
  type ToolCallEntitySchema,
  type ToolCallEntityUpdateSchema,
  type ToolCallMessageIdSchema,
  type ToolCallNameSchema,
  type ToolCallProjectIdSchema,
  type ToolCallSchema,
  type ToolCallSessionIdSchema,
  type ToolCallStatusSchema,
  type ToolCallSuccessResponseSchema,
  type ToolCallUpdateSchema,
  type ToolCallsReadByQuerySchema,
  type ToolCallsReadBySchema,
  type ToolCallsSuccessResponseSchema,
} from './schemas';

export type ToolCallStatus = z.infer<typeof ToolCallStatusSchema>;

export type ToolCallProjectId = z.infer<typeof ToolCallProjectIdSchema>;
export type ToolCallSessionId = z.infer<typeof ToolCallSessionIdSchema>;
export type ToolCallMessageId = z.infer<typeof ToolCallMessageIdSchema>;
export type ToolCallName = z.infer<typeof ToolCallNameSchema>;
export type ToolCallArguments = z.infer<typeof ToolCallArgumentsSchema>;
export type ToolCallBase = z.infer<typeof ToolCallBaseSchema>;

export type ToolCallEntity = z.infer<typeof ToolCallEntitySchema>;
export type ToolCallEntityCreate = z.infer<typeof ToolCallEntityCreateSchema>;
export type ToolCallEntityUpdate = z.infer<typeof ToolCallEntityUpdateSchema>;

export type ToolCall = z.infer<typeof ToolCallSchema>;
export type ToolCallCreate = z.infer<typeof ToolCallCreateSchema>;
export type ToolCallUpdate = z.infer<typeof ToolCallUpdateSchema>;
export type ToolCallsReadBy = ExactPartial<
  z.infer<typeof ToolCallsReadBySchema>
>;
export type ToolCallsReadByQuery = z.infer<typeof ToolCallsReadByQuerySchema>;

export type ToolCallSuccessResponse = z.infer<
  typeof ToolCallSuccessResponseSchema
>;
export type ToolCallsSuccessResponse = z.infer<
  typeof ToolCallsSuccessResponseSchema
>;
