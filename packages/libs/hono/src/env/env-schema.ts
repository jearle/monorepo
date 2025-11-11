import { z } from 'zod';

import { NodeEnvSchema } from '@jearle/util-env';

export const EnvSchema = z.object({
  NODE_ENV: NodeEnvSchema,
  HOSTNAME: z.string(),
  PORT: z.string(),
});
