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

test(`template render and analyze inspect util-template behavior`, async () => {
  const directoryPath = await createTempDirectory();

  try {
    const templateFile = path.join(directoryPath, `message.liquid`);
    const dataFile = path.join(directoryPath, `data.json`);

    await writeFile(templateFile, `Hello {{ user.name }}`);
    await writeFile(dataFile, `{"user":{"name":"Ada"}}`);

    const renderResult = await captureCLI({
      run: () =>
        app.execute(`template render`, [
          `--data-file`,
          dataFile,
          `--template-file`,
          templateFile,
        ]),
    });
    const analyzeResult = await captureCLI({
      run: () =>
        app.execute(`template analyze`, [`--template-file`, templateFile]),
    });

    expect(renderResult).toMatchObject({
      exitCode: 0,
      stdout: `Hello Ada`,
    });
    expect(analyzeResult.exitCode).toBe(0);
    expect(analyzeResult.stdout).toContain(`"user.name"`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`template render-file renders from a configured root`, async () => {
  const directoryPath = await createTempDirectory();

  try {
    const templateFile = path.join(directoryPath, `rooted.liquid`);
    const dataFile = path.join(directoryPath, `data.json`);

    await writeFile(templateFile, `Root {{ name | upcase }}`);
    await writeFile(dataFile, `{"name":"Ada"}`);

    const result = await captureCLI({
      run: () =>
        app.execute(`template render-file`, [
          `--data-file`,
          dataFile,
          `--root`,
          directoryPath,
          `--template`,
          `rooted.liquid`,
        ]),
    });

    expect(result).toMatchObject({
      exitCode: 0,
      stdout: `Root ADA`,
    });
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`template render reports util-template failures`, async () => {
  const directoryPath = await createTempDirectory();

  try {
    const templateFile = path.join(directoryPath, `message.liquid`);
    const dataFile = path.join(directoryPath, `data.json`);

    await writeFile(templateFile, `Hello {{ user.name }}`);
    await writeFile(dataFile, `{}`);

    const result = await captureCLI({
      run: () =>
        app.execute(`template render`, [
          `--data-file`,
          dataFile,
          `--template-file`,
          templateFile,
        ]),
    });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain(`TEMPLATE_MISSING_VARIABLE`);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});
