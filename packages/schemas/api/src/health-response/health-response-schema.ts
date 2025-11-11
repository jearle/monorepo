import { BaseResponseSchema } from '../base-response';

import { HealthDataSchema } from './health-data-schema';

export const HealthResponseSchema = BaseResponseSchema.extend({
  data: HealthDataSchema,
});
