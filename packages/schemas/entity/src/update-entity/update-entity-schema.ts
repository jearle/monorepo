import { z } from 'zod';

export const UpdateEntitySchema = z
  .object({
    name: z.string().trim().min(1).max(255),
    metadata: z.record(z.string(), z.unknown()),
  })
  .partial()
  .extend({ id: z.string() });
