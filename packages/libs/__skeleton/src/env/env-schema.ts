import { z } from 'zod';

import { NodeEnvSchema } from '@jearle/util-env';
import { LevelSchema } from '@jearle/util-logger';

export const EnvSchema = z.object({
  NODE_ENV: NodeEnvSchema.default(`development`),
  LOG_LEVEL: LevelSchema.default(`info`),
});
