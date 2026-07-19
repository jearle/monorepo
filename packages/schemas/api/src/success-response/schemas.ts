import { z } from 'zod';

import { BaseResponseSchema } from '../base-response';

export const SuccessResponseDataSchema = z.object({
  success: z.boolean(),
});

export const SuccessResponseSchema = z.object({
  ...BaseResponseSchema.shape,
  data: SuccessResponseDataSchema,
});
