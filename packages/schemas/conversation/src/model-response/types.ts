import { type z } from 'zod';

import { type ExactPartial } from '@jearle/util-types';

import {
  type ModelResponseBaseSchema,
  type ModelResponseCreateSchema,
  type ModelResponseEntityCreateSchema,
  type ModelResponseEntitySchema,
  type ModelResponseEntityUpdateSchema,
  type ModelResponseLatencyMsSchema,
  type ModelResponseMessageIdSchema,
  type ModelResponseModelSchema,
  type ModelResponseProjectIdSchema,
  type ModelResponseProviderSchema,
  type ModelResponseRawPayloadSchema,
  type ModelResponseSchema,
  type ModelResponseSessionIdSchema,
  type ModelResponseSuccessResponseSchema,
  type ModelResponseTokenUsageSchema,
  type ModelResponseUpdateSchema,
  type ModelResponsesReadByQuerySchema,
  type ModelResponsesReadBySchema,
  type ModelResponsesSuccessResponseSchema,
} from './schemas';

export type ModelResponseProjectId = z.infer<
  typeof ModelResponseProjectIdSchema
>;
export type ModelResponseSessionId = z.infer<
  typeof ModelResponseSessionIdSchema
>;
export type ModelResponseMessageId = z.infer<
  typeof ModelResponseMessageIdSchema
>;
export type ModelResponseProvider = z.infer<typeof ModelResponseProviderSchema>;
export type ModelResponseModel = z.infer<typeof ModelResponseModelSchema>;
export type ModelResponseLatencyMs = z.infer<
  typeof ModelResponseLatencyMsSchema
>;
export type ModelResponseTokenUsage = z.infer<
  typeof ModelResponseTokenUsageSchema
>;
export type ModelResponseRawPayload = z.infer<
  typeof ModelResponseRawPayloadSchema
>;
export type ModelResponseBase = z.infer<typeof ModelResponseBaseSchema>;

export type ModelResponseEntity = z.infer<typeof ModelResponseEntitySchema>;
export type ModelResponseEntityCreate = z.infer<
  typeof ModelResponseEntityCreateSchema
>;
export type ModelResponseEntityUpdate = z.infer<
  typeof ModelResponseEntityUpdateSchema
>;

export type ModelResponse = z.infer<typeof ModelResponseSchema>;
export type ModelResponseCreate = z.infer<typeof ModelResponseCreateSchema>;
export type ModelResponseUpdate = z.infer<typeof ModelResponseUpdateSchema>;
export type ModelResponsesReadBy = ExactPartial<
  z.infer<typeof ModelResponsesReadBySchema>
>;
export type ModelResponsesReadByQuery = z.infer<
  typeof ModelResponsesReadByQuerySchema
>;

export type ModelResponseSuccessResponse = z.infer<
  typeof ModelResponseSuccessResponseSchema
>;
export type ModelResponsesSuccessResponse = z.infer<
  typeof ModelResponsesSuccessResponseSchema
>;
