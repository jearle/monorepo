import { test, expect } from 'bun:test';

import { NODE_ENV_DEVELOPMENT } from '@jearle/util-env';

import { LEVEL_TRACE } from '../level';

import { createLogger } from './create-logger';

test(`createLogger({ name, level, nodeEnv: NODE_ENV_DEVELOPMENT })`, () => {
  const { logger } = createLogger({
    name: `test`,
    level: LEVEL_TRACE,
    nodeEnv: NODE_ENV_DEVELOPMENT,
  });

  expect(logger).toBeDefined();
});
