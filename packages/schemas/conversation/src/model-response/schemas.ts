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

export const ModelResponseProjectIdSchema = z.object({
  projectId: z.uuid(),
});

export const ModelResponseSessionIdSchema = z.object({
  sessionId: z.uuid(),
});

export const ModelResponseMessageIdSchema = z.object({
  messageId: z.uuid(),
});

export const ModelResponseProviderSchema = z.object({
  provider: z.string().trim().min(1).max(64),
});

export const ModelResponseModelSchema = z.object({
  model: z.string().trim().min(1).max(128),
});

export const ModelResponseLatencyMsSchema = z.object({
  latencyMs: z.int().min(0),
});

export const ModelResponseTokenUsageSchema = z.object({
  tokenUsage: z.record(z.string(), z.unknown()),
});

export const ModelResponseRawPayloadSchema = z.object({
  rawPayload: z.record(z.string(), z.unknown()),
});

export const ModelResponseBaseSchema = z.object({
  ...ModelResponseProviderSchema.shape,
  ...ModelResponseModelSchema.shape,
  ...ModelResponseLatencyMsSchema.shape,
  ...ModelResponseTokenUsageSchema.shape,
  ...ModelResponseRawPayloadSchema.shape,
});

export const ModelResponseEntitySchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityAtSchema.shape,
  ...EntityMetadataSchema.shape,
  ...ModelResponseProjectIdSchema.shape,
  ...ModelResponseSessionIdSchema.shape,
  ...ModelResponseMessageIdSchema.shape,
  ...ModelResponseBaseSchema.shape,
});

export const ModelResponseEntityCreateSchema = z.object({
  ...EntityMetadataSchema.shape,
  ...ModelResponseProjectIdSchema.shape,
  ...ModelResponseSessionIdSchema.shape,
  ...ModelResponseMessageIdSchema.shape,
  ...ModelResponseBaseSchema.shape,
});

export const ModelResponseEntityUpdateSchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityMetadataSchema.partial().shape,
  ...ModelResponseBaseSchema.partial().shape,
});

export const ModelResponseSchema = ModelResponseEntitySchema;

export const ModelResponseCreateSchema = z.object({
  ...EntityMetadataSchema.shape,
  ...ModelResponseProjectIdSchema.shape,
  ...ModelResponseSessionIdSchema.shape,
  ...ModelResponseMessageIdSchema.shape,
  ...ModelResponseBaseSchema.shape,
});

export const ModelResponseUpdateSchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityMetadataSchema.partial().shape,
  ...ModelResponseBaseSchema.partial().shape,
});

export const ModelResponsesReadBySchema = z
  .object({
    ...EntityIdSchema.shape,
    ...EntityMetadataSchema.shape,
    ...ModelResponseProjectIdSchema.shape,
    ...ModelResponseSessionIdSchema.shape,
    ...ModelResponseMessageIdSchema.shape,
    ...ModelResponseBaseSchema.shape,
  })
  .partial();

export const ModelResponsesReadByQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  ...ModelResponsesReadBySchema.shape,
});

export const ModelResponseSuccessResponseDataSchema = z.object({
  ...SuccessResponseDataSchema.shape,
  modelResponse: ModelResponseSchema,
});

export const ModelResponseSuccessResponseSchema = z.object({
  ...SuccessResponseSchema.shape,
  data: ModelResponseSuccessResponseDataSchema,
});

export const ModelResponsesSuccessResponseDataSchema = z.object({
  ...SuccessResponseDataSchema.shape,
  modelResponses: z.array(ModelResponseSchema),
});

export const ModelResponsesSuccessResponseSchema = z.object({
  ...SuccessResponseSchema.shape,
  data: ModelResponsesSuccessResponseDataSchema,
});
