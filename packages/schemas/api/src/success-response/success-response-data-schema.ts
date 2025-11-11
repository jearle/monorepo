import { z } from 'zod';

export const SuccessResponseDataSchema = z.object({
  success: z.boolean(),
});
