import { test, expect } from 'bun:test';
import { z } from 'zod';

import { parseEnv } from './parse-env';

const EnvSchema = z.object({
  DATABASE_URL: z.string(),
});

test(`parseEnv({ EnvSchema })`, () => {
  const { env } = parseEnv({ EnvSchema });

  const { success } = EnvSchema.safeParse(env);

  expect(success).toBeTrue();
});
