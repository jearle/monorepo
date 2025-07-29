import { z } from 'zod';
import { HealthSchema } from '@lbb/schema-health';

export const HealthResponseSchema = HealthSchema.extend({
  statusCode: z.number(),
});
