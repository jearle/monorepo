import { expect, test } from 'bun:test';

import { createEnv } from '../env';
import { createHealthLogger } from '../logger';

import { createServices } from '.';

const { env } = createEnv();
const { logger } = createHealthLogger({ env });

test(`createServices({ env, logger })`, async () => {
  const { env } = createEnv();

  const { services } = await createServices({ env, logger });

  expect(services).toBeDefined();
});
