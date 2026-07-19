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

test(`json parse and stringify expose util-json behavior`, async () => {
  const directoryPath = await createTempDirectory();

  try {
    const jsonFile = path.join(directoryPath, `input.json`);

    await writeFile(jsonFile, `{"z":2,"a":1}`);

    const parseResult = await captureCLI({
      run: () =>
        app.execute(`json parse`, [`--file`, jsonFile, `--space`, `0`]),
    });
    const stringifyResult = await captureCLI({
      run: () =>
        app.execute(`json stringify`, [`--file`, jsonFile, `--space`, `0`]),
    });

    expect(parseResult.stdout).toBe(`{"z":2,"a":1}\n`);
    expect(stringifyResult.stdout).toBe(`{"z":2,"a":1}\n`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`json stable-stringify sorts object keys`, async () => {
  const directoryPath = await createTempDirectory();

  try {
    const jsonFile = path.join(directoryPath, `input.json`);

    await writeFile(jsonFile, `{"z":2,"a":{"d":4,"b":2}}`);

    const result = await captureCLI({
      run: () =>
        app.execute(`json stable-stringify`, [
          `--file`,
          jsonFile,
          `--space`,
          `0`,
        ]),
    });

    expect(result.stdout).toBe(`{"a":{"b":2,"d":4},"z":2}\n`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`json parse reports parse errors`, async () => {
  const directoryPath = await createTempDirectory();

  try {
    const jsonFile = path.join(directoryPath, `invalid.json`);

    await writeFile(jsonFile, `{bad`);

    const result = await captureCLI({
      run: () => app.execute(`json parse`, [`--file`, jsonFile]),
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr.length).toBeGreaterThan(0);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});
