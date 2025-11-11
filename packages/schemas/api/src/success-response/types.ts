import { z } from 'zod';

import { SuccessResponseDataSchema } from './success-response-data-schema';
import { SuccessResponseSchema } from './success-response-schema';

export type SuccessResponseData = z.infer<typeof SuccessResponseDataSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
