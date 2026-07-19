import { z } from 'zod';

export const ResultErrorSchema = z.strictObject({
  message: z.string(),
  code: z.string().optional(),
});
