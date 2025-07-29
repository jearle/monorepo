import { z } from 'zod';
import { HealthResponseSchema } from './health-response-schema';

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
