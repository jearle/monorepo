import { z } from 'zod';

export const BaseErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  timestamp: z.iso.datetime(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
});
