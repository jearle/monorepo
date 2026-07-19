import { type z } from 'zod';

import { type HealthResponseSchema } from './health-response-schema';
import { type HealthStatusSchema } from './health-status-schema';
import { type HealthDataSchema } from './health-data-schema';

export type HealthStatus = Readonly<z.infer<typeof HealthStatusSchema>>;
export type HealthData = Readonly<z.infer<typeof HealthDataSchema>>;
export type HealthResponse = Readonly<z.infer<typeof HealthResponseSchema>>;
