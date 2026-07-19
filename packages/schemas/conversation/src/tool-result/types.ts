import { type z } from 'zod';

import { type ExactPartial } from '@jearle/util-types';

import {
  type ToolResultBaseSchema,
  type ToolResultCreateRequestSchema,
  type ToolResultCreateSchema,
  type ToolResultEntityCreateSchema,
  type ToolResultEntitySchema,
  type ToolResultEntityUpdateSchema,
  type ToolResultErrorSchema,
  type ToolResultOutputSchema,
  type ToolResultProjectIdSchema,
  type ToolResultSchema,
  type ToolResultSessionIdSchema,
  type ToolResultStatusSchema,
  type ToolResultSuccessResponseSchema,
  type ToolResultToolCallIdSchema,
  type ToolResultUpdateSchema,
  type ToolResultsReadByQuerySchema,
  type ToolResultsReadBySchema,
  type ToolResultsSuccessResponseSchema,
} from './schemas';

export type ToolResultStatus = z.infer<typeof ToolResultStatusSchema>;

export type ToolResultProjectId = z.infer<typeof ToolResultProjectIdSchema>;
export type ToolResultSessionId = z.infer<typeof ToolResultSessionIdSchema>;
export type ToolResultToolCallId = z.infer<typeof ToolResultToolCallIdSchema>;
export type ToolResultOutput = z.infer<typeof ToolResultOutputSchema>;
export type ToolResultError = z.infer<typeof ToolResultErrorSchema>;
export type ToolResultBase = z.infer<typeof ToolResultBaseSchema>;
export type ToolResultCreateRequest = z.infer<
  typeof ToolResultCreateRequestSchema
>;

export type ToolResultEntity = z.infer<typeof ToolResultEntitySchema>;
export type ToolResultEntityCreate = z.infer<
  typeof ToolResultEntityCreateSchema
>;
export type ToolResultEntityUpdate = z.infer<
  typeof ToolResultEntityUpdateSchema
>;

export type ToolResult = z.infer<typeof ToolResultSchema>;
export type ToolResultCreate = z.infer<typeof ToolResultCreateSchema>;
export type ToolResultUpdate = z.infer<typeof ToolResultUpdateSchema>;
export type ToolResultsReadBy = ExactPartial<
  z.infer<typeof ToolResultsReadBySchema>
>;
export type ToolResultsReadByQuery = z.infer<
  typeof ToolResultsReadByQuerySchema
>;

export type ToolResultSuccessResponse = z.infer<
  typeof ToolResultSuccessResponseSchema
>;
export type ToolResultsSuccessResponse = z.infer<
  typeof ToolResultsSuccessResponseSchema
>;
