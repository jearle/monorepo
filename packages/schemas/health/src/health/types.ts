import { z } from 'zod';
import type { HealthSchema } from './health-schema';
import type { StatusSchema } from './status-schema';

export type Health = z.infer<typeof HealthSchema>;
export type Status = z.infer<typeof StatusSchema>;
