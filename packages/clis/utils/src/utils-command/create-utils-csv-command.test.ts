import { rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { captureCLI } from '@jearle/util-cli';
import { createTempDirectory } from '@jearle/util-fs';
import { expect, test } from 'bun:test';

import { createApp } from '../app';
import { createLogger } from '../logger';
import { createServices } from '../services';

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

test(`csv parse reports row and column shape`, async () => {
  const directoryPath = await createTempDirectory();

  try {
    const csvFile = path.join(directoryPath, `input.csv`);

    await writeFile(csvFile, `name,role\nAda,engineer\n`);

    const result = await captureCLI({
      run: () => app.execute(`csv parse`, [`--file`, csvFile, `--header`]),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`"rowCount": 1`);
    expect(result.stdout).toContain(`"columnCount": 2`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`csv export stringifies JSON input`, async () => {
  const directoryPath = await createTempDirectory();

  try {
    const jsonRowsFile = path.join(directoryPath, `rows.json`);

    await writeFile(jsonRowsFile, `[{"name":"Ada","role":"engineer"}]`);

    const result = await captureCLI({
      run: () =>
        app.execute(`csv export`, [`--file`, jsonRowsFile, `--header`]),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`name,role`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`csv export reports invalid input shape`, async () => {
  const directoryPath = await createTempDirectory();

  try {
    const jsonFile = path.join(directoryPath, `bad.json`);

    await writeFile(jsonFile, `42`);

    const result = await captureCLI({
      run: () => app.execute(`csv export`, [`--file`, jsonFile]),
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain(`array of rows`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});
