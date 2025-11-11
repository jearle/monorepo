import { z } from 'zod';

import { HealthStatusSchema } from './health-status-schema';

export const HealthDataSchema = z.object({
  status: HealthStatusSchema,
  statusCode: z.number(),
  timestamp: z.iso.datetime(),
  uptime: z.number(),
});
