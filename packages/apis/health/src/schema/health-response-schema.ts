import { BaseResponseSchema } from '@jearle/schema-api';

import { HealthDataSchema } from './health-data-schema';

export const HealthResponseSchema = BaseResponseSchema.extend({
  data: HealthDataSchema,
});
