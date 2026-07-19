#!/usr/bin/env bun

import { createApp } from './app';
import { createEnv } from './env';
import { createLogger } from './logger';
import { createServices } from './services';

export const main = async () => {
  const { env } = createEnv();
  const { logger } = createLogger({ env });
  const { services } = createServices({ env, logger });
  const { app } = await createApp({
    env,
    logger,
    services,
  });

  await app.run();
};

await main();
