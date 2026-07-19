import { BaseResponseSchema } from '../base-response';

import { FailureResponseDataSchema } from './failure-response-data-schema';

export const FailureResponseSchema = BaseResponseSchema.extend({
  data: FailureResponseDataSchema,
});
