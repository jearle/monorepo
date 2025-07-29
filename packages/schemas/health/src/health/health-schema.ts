import { z } from 'zod';

import { StatusSchema } from './status-schema';

export const HealthSchema = z.object({
  status: StatusSchema,
  timestamp: z.iso.datetime(),
  uptime: z.number(),
});
