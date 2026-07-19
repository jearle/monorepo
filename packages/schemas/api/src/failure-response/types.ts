import { type z } from 'zod';

import { FailureResponseDataSchema } from './failure-response-data-schema';
import { FailureResponseSchema } from './failure-response-schema';

export type FailureResponseData = z.infer<typeof FailureResponseDataSchema>;
export type FailureResponse = z.infer<typeof FailureResponseSchema>;
