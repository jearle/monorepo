import { captureCLI } from '@jearle/util-cli';
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

test(`http request prints response envelopes`, async () => {
  const server = Bun.serve({
    port: 0,
    fetch: async (request) => {
      const body = await request.text();
      const response = new Response(`ok ${body}`, {
        headers: {
          [`x-test`]: `yes`,
        },
      });

      return response;
    },
  });

  try {
    const url = new URL(`/resource`, server.url).href;
    const result = await captureCLI({
      run: () =>
        app.execute(`http request`, [
          url,
          `--body`,
          `payload`,
          `--header`,
          `x-request: yes`,
          `--max-attempts`,
          `1`,
          `--method`,
          `post`,
        ]),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`"status": 200`);
    expect(result.stdout).toContain(`ok payload`);
    expect(result.stdout).toContain(`"x-test": "yes"`);
  } finally {
    await server.stop(true);
  }
});

test(`http request reports Result errors`, async () => {
  const result = await captureCLI({
    run: () =>
      app.execute(`http request`, [
        `resource`,
        `--base-url`,
        `relative`,
        `--max-attempts`,
        `1`,
      ]),
  });

  expect(result.exitCode).toBe(1);
  expect(result.stderr).toContain(`HTTP_INVALID_OPTIONS`);
});

test(`http request sends JSON bodies for JSON responses`, async () => {
  const server = Bun.serve({
    port: 0,
    fetch: async (request) => {
      const body = await request.json();
      const response = Response.json({
        body,
        header: request.headers.get(`x-request`),
      });

      return response;
    },
  });

  try {
    const url = new URL(`/json`, server.url).href;
    const result = await captureCLI({
      run: () =>
        app.execute(`http request`, [
          url,
          `--json`,
          `{"value":"hello"}`,
          `--json-response`,
          `--header`,
          `x-request: yes`,
          `--max-attempts`,
          `1`,
          `--method`,
          `post`,
        ]),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`"value": "hello"`);
    expect(result.stdout).toContain(`"header": "yes"`);
  } finally {
    await server.stop(true);
  }
});
