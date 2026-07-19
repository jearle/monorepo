import { rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { captureCLI } from '@jearle/util-cli';
import { createTempDirectory } from '@jearle/util-fs';
import { expect, test } from 'bun:test';

import { createApp } from '../app';
import { createLogger } from '../logger';
import { createServices } from '../services';

const packageRootPath = path.resolve(import.meta.dir, `../..`);
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

test(`env validate checks env files through util-env`, async () => {
  const directoryPath = await createTempDirectory({
    parentDirectoryPath: packageRootPath,
    prefix: `.tmp-`,
  });

  try {
    const envFile = path.join(directoryPath, `.env`);
    const invalidEnvFile = path.join(directoryPath, `.env.invalid`);

    await writeFile(envFile, `NODE_ENV=test\n`);
    await writeFile(invalidEnvFile, `NODE_ENV=staging\n`);

    const successResult = await captureCLI({
      run: () =>
        app.execute(`env validate`, [
          `--file`,
          envFile,
          `--schema`,
          `node-env`,
        ]),
    });
    const failureResult = await captureCLI({
      run: () =>
        app.execute(`env validate`, [
          `--file`,
          invalidEnvFile,
          `--schema`,
          `node-env`,
        ]),
    });

    expect(successResult.exitCode).toBe(0);
    expect(successResult.stdout).toContain(`"NODE_ENV": "test"`);
    expect(failureResult.exitCode).toBe(1);
    expect(failureResult.stderr).toContain(`NODE_ENV`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`env validate loads schema files`, async () => {
  const directoryPath = await createTempDirectory({
    parentDirectoryPath: packageRootPath,
    prefix: `.tmp-`,
  });

  try {
    const schemaFile = path.join(directoryPath, `env-schema.ts`);
    const envFile = path.join(directoryPath, `.env.custom`);

    await writeFile(envFile, `API_URL=https://api.example.test\n`);
    await writeFile(
      schemaFile,
      [
        `import { z } from 'zod';`,
        `export const EnvSchema = z.object({ API_URL: z.url() });`,
      ].join(`\n`),
    );

    const result = await captureCLI({
      run: () =>
        app.execute(`env validate`, [
          `--file`,
          envFile,
          `--schema-file`,
          schemaFile,
        ]),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`https://api.example.test`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});
