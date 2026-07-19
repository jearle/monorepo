import { type z } from 'zod';

import {
  type SuccessResponseDataSchema,
  type SuccessResponseSchema,
} from './schemas';

export type SuccessResponseData = z.infer<typeof SuccessResponseDataSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
