import { type z } from 'zod';
import { type UpdateEntitySchema } from './update-entity-schema';

export type UpdateEntity = z.infer<typeof UpdateEntitySchema>;
