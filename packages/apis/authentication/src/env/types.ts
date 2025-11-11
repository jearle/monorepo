import { z } from 'zod';

import { EnvSchema } from './env-schema';

export type Env = z.infer<typeof EnvSchema>;
