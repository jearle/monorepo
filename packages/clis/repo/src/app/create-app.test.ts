import { expect, test } from 'bun:test';
import { captureCLI } from '@jearle/util-cli';

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

test(`routes nested verify deps command through standalone repo CLI`, async () => {
  const result = await captureCLI({
    run: async () => {
      const env = {
        NODE_ENV: `test`,
        LOG_LEVEL: `fatal`,
      } as const;
      const { logger } = createLogger({ env });
      const { services } = createServices({ env, logger });
      const { app } = await createApp({
        env,
        logger,
        services,
      });

      await app.run([`verify`, `deps`, `--help`]);
    },
  });

  expect(result.stdout).toContain(`Usage: repo verify deps`);
});

test(`routes lint command through standalone repo CLI`, async () => {
  const result = await captureCLI({
    run: async () => {
      const env = {
        NODE_ENV: `test`,
        LOG_LEVEL: `fatal`,
      } as const;
      const { logger } = createLogger({ env });
      const { services } = createServices({ env, logger });
      const { app } = await createApp({
        env,
        logger,
        services,
      });

      await app.run([`lint`, `--help`]);
    },
  });

  expect(result.stdout).toContain(`Usage: repo lint`);
});

test(`routes nested verify package-exports command through standalone repo CLI`, async () => {
  const result = await captureCLI({
    run: async () => {
      const env = {
        NODE_ENV: `test`,
        LOG_LEVEL: `fatal`,
      } as const;
      const { logger } = createLogger({ env });
      const { services } = createServices({ env, logger });
      const { app } = await createApp({
        env,
        logger,
        services,
      });

      await app.run([`verify`, `package-exports`, `--help`]);
    },
  });

  expect(result.stdout).toContain(`Usage: repo verify package-exports`);
});

test(`routes package verify command through standalone repo CLI`, async () => {
  const result = await captureCLI({
    run: async () => {
      const env = {
        NODE_ENV: `test`,
        LOG_LEVEL: `fatal`,
      } as const;
      const { logger } = createLogger({ env });
      const { services } = createServices({ env, logger });
      const { app } = await createApp({
        env,
        logger,
        services,
      });

      await app.run([`package`, `verify`, `--help`]);
    },
  });

  expect(result.stdout).toContain(`Usage: repo package verify`);
});
