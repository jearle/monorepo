import { test, expect } from 'bun:test';

import { createEnv } from '../env';
import { createHealthLogger } from '../logger';
import { createServices } from '../services';

import { createMiddlewares } from './create-middlewares';

const { env } = createEnv();
const { logger } = createHealthLogger({ env });
const { services } = await createServices({ env, logger });

test(`createMiddlewares({ env })`, async () => {
  const { middlewares } = createMiddlewares({ services, logger });

  expect(middlewares).toBeDefined();
});
