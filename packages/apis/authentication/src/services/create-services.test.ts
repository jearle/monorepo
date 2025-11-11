import { test, expect } from 'bun:test';

import { createEnv } from '../env';
import { createAuthenticationLogger } from '../logger';

import { createServices } from './create-services';

const { env } = createEnv();
const { logger } = createAuthenticationLogger({ env });

test(`createServices({ env })`, async () => {
  const { services } = await createServices({ env, logger });

  expect(services).toBeDefined();
});
