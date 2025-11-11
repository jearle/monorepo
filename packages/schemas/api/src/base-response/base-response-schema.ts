import { z } from 'zod';

import { ClientErrorSchema, SystemErrorSchema } from '@jearle/schema-error';

export const BaseResponseSchema = z.object({
  clientErrors: z.array(ClientErrorSchema),
  systemErrors: z.array(SystemErrorSchema),
  data: z.record(z.string(), z.unknown()),
});
