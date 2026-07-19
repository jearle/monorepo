import { expect, test } from 'bun:test';
import { z } from 'zod';

import { validateEnv } from '.';

const EnvSchema = z.object({
  DATABASE_URL: z.url(),
});

test(`validateEnv returns env data for valid input`, () => {
  const result = validateEnv({
    EnvSchema,
    env: {
      DATABASE_URL: `https://database.example.test`,
    },
  });

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.env.DATABASE_URL).toBe(`https://database.example.test`);
});

test(`validateEnv returns a validation tree for invalid input`, () => {
  const result = validateEnv({
    EnvSchema,
    env: {
      DATABASE_URL: `not-a-url`,
    },
  });

  expect(result.success).toBeFalse();

  if (result.success === true) {
    expect.unreachable();
  }

  expect(JSON.stringify(result.error)).toContain(`DATABASE_URL`);
});
