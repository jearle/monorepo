import { z } from 'zod';

export const FailureResponseDataSchema = z.object({
  success: z.literal(false),
});
