import { type z } from 'zod';

import { type ExactPartial } from '@jearle/util-types';

import {
  type SessionAgentIdSchema,
  type SessionAssignmentSchema,
  type SessionBaseSchema,
  type SessionCreateSchema,
  type SessionEntityCreateSchema,
  type SessionEntitySchema,
  type SessionEntityUpdateSchema,
  type SessionLLMProfileIdSchema,
  type SessionOwnerUserIdSchema,
  type SessionProjectIdSchema,
  type SessionSchema,
  type SessionStateSchema,
  type SessionSuccessResponseSchema,
  type SessionUpdateSchema,
  type SessionsReadByQuerySchema,
  type SessionsReadBySchema,
  type SessionsSuccessResponseSchema,
} from './schemas';

export type SessionState = z.infer<typeof SessionStateSchema>;

export type SessionProjectId = z.infer<typeof SessionProjectIdSchema>;
export type SessionOwnerUserId = z.infer<typeof SessionOwnerUserIdSchema>;
export type SessionAgentId = z.infer<typeof SessionAgentIdSchema>;
export type SessionLLMProfileId = z.infer<typeof SessionLLMProfileIdSchema>;
export type SessionAssignment = z.infer<typeof SessionAssignmentSchema>;
export type SessionBase = z.infer<typeof SessionBaseSchema>;

export type SessionEntity = z.infer<typeof SessionEntitySchema>;
export type SessionEntityCreate = z.infer<typeof SessionEntityCreateSchema>;
export type SessionEntityUpdate = z.infer<typeof SessionEntityUpdateSchema>;

export type Session = z.infer<typeof SessionSchema>;
export type SessionCreate = z.infer<typeof SessionCreateSchema>;
export type SessionUpdate = z.infer<typeof SessionUpdateSchema>;
export type SessionsReadBy = ExactPartial<z.infer<typeof SessionsReadBySchema>>;
export type SessionsReadByQuery = z.infer<typeof SessionsReadByQuerySchema>;

export type SessionSuccessResponse = z.infer<
  typeof SessionSuccessResponseSchema
>;
export type SessionsSuccessResponse = z.infer<
  typeof SessionsSuccessResponseSchema
>;
