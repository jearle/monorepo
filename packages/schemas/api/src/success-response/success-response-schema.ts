import { BaseResponseSchema } from '../base-response';

import { SuccessResponseDataSchema } from './success-response-data-schema';

export const SuccessResponseSchema = BaseResponseSchema.extend({
  data: SuccessResponseDataSchema,
});
