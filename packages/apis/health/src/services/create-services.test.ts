import { test, expect } from 'bun:test';

import { createEnv } from '../env';
import { createHealthLogger } from '../logger';

import { createServices } from './create-services';

const { env } = createEnv();
const { logger } = createHealthLogger({ env });

test(`createServices({ env })`, async () => {
  const { env } = createEnv();

  const { services } = await createServices({ env, logger });

  expect(services).toBeDefined();
});
