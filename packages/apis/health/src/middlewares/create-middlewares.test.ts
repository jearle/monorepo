import { expect, test } from 'bun:test';

import { createEnv } from '../env';
import { createHealthLogger } from '../logger';
import { createServices } from '../services';

import { createMiddlewares } from '.';

const { env } = createEnv();
const { logger } = createHealthLogger({ env });
const { services } = await createServices({ env, logger });

test(`createMiddlewares({ services })`, async () => {
  const { middlewares } = createMiddlewares({ services });

  expect(middlewares).toBeDefined();
});
