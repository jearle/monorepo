import { z } from 'zod';

import { NodeEnvSchema } from '@jearle/util-env';
import { LevelSchema } from '@jearle/util-logger';

export const EnvSchema = z.object({
  NODE_ENV: NodeEnvSchema,
  LOG_LEVEL: LevelSchema,
  OPENROUTER_API: z.string(),
  OPENROUTER_API_KEY: z.string(),
  OPENROUTER_MODEL: z.string(),
  OPENROUTER_EMBEDDINGS_MODEL: z.string(),
});
