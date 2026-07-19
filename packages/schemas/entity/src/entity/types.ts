import { type z } from 'zod';

import {
  type EntityAtSchema,
  type EntityBaseSchema,
  type EntityCreateSchema,
  type EntityIdSchema,
  type EntityMetadataSchema,
  type EntityNameSchema,
  type EntitySchema,
  type EntityUpdateSchema,
} from './schemas';

export type EntityId = z.infer<typeof EntityIdSchema>;
export type EntityAt = z.infer<typeof EntityAtSchema>;
export type EntityName = z.infer<typeof EntityNameSchema>;
export type EntityMetadata = z.infer<typeof EntityMetadataSchema>;
export type EntityBase = z.infer<typeof EntityBaseSchema>;
export type Entity = z.infer<typeof EntitySchema>;
export type EntityCreate = z.infer<typeof EntityCreateSchema>;
export type EntityUpdate = z.infer<typeof EntityUpdateSchema>;
