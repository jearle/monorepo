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

import { SESSION_STATES } from './constants';

export const SessionStateSchema = z.literal(SESSION_STATES);

export const SessionProjectIdSchema = z.object({
  projectId: z.uuid(),
});

export const SessionOwnerUserIdSchema = z.object({
  ownerUserId: z.uuid(),
});

export const SessionAgentIdSchema = z.object({
  agentId: z.uuid().nullable(),
});

export const SessionLLMProfileIdSchema = z.object({
  llmProfileId: z.uuid().nullable(),
});

export const SessionAssignmentSchema = z.object({
  ...SessionOwnerUserIdSchema.shape,
  ...SessionAgentIdSchema.shape,
  ...SessionLLMProfileIdSchema.shape,
});

export const SessionBaseSchema = z.object({
  state: SessionStateSchema,
});

export const SessionEntitySchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityAtSchema.shape,
  ...EntityMetadataSchema.shape,
  ...SessionProjectIdSchema.shape,
  ...SessionAssignmentSchema.shape,
  ...SessionBaseSchema.shape,
});

export const SessionEntityCreateSchema = z.object({
  ...EntityMetadataSchema.shape,
  ...SessionProjectIdSchema.shape,
  ...SessionAssignmentSchema.shape,
  ...SessionBaseSchema.shape,
});

export const SessionEntityUpdateSchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityMetadataSchema.partial().shape,
  ...SessionAssignmentSchema.partial().shape,
  ...SessionBaseSchema.partial().shape,
});

export const SessionSchema = SessionEntitySchema;

export const SessionCreateSchema = z.object({
  ...EntityMetadataSchema.shape,
  ...SessionProjectIdSchema.shape,
  ...SessionBaseSchema.shape,
});

export const SessionUpdateSchema = z.object({
  ...EntityIdSchema.shape,
  ...EntityMetadataSchema.partial().shape,
  ...SessionBaseSchema.partial().shape,
});

export const SessionsReadBySchema = z
  .object({
    ...EntityIdSchema.shape,
    ...EntityMetadataSchema.shape,
    ...SessionProjectIdSchema.shape,
    ...SessionAssignmentSchema.shape,
    ...SessionBaseSchema.shape,
  })
  .partial();

export const SessionsReadByQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  ...SessionsReadBySchema.shape,
});

export const SessionSuccessResponseDataSchema = z.object({
  ...SuccessResponseDataSchema.shape,
  session: SessionSchema,
});

export const SessionSuccessResponseSchema = z.object({
  ...SuccessResponseSchema.shape,
  data: SessionSuccessResponseDataSchema,
});

export const SessionsSuccessResponseDataSchema = z.object({
  ...SuccessResponseDataSchema.shape,
  sessions: z.array(SessionSchema),
});

export const SessionsSuccessResponseSchema = z.object({
  ...SuccessResponseSchema.shape,
  data: SessionsSuccessResponseDataSchema,
});
