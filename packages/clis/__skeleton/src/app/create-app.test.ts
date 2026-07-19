import { expect, test } from 'bun:test';

import { createLogger } from '../logger';
import { createServices } from '../services';
import { createApp } from '.';

test(`creates a composed CLI app`, async () => {
  const env = {
    NODE_ENV: `test`,
    LOG_LEVEL: `fatal`,
  } as const;
  const { logger } = createLogger({ env });
  const { services } = createServices({ env, logger });
  const result = await createApp({
    env,
    logger,
    services,
  });

  expect(result.app).toBeDefined();
});
