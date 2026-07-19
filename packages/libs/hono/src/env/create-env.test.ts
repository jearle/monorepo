import { expect, test } from 'bun:test';

import { createEnv } from '.';

test(`createEnv()`, () => {
  const { env } = createEnv();

  expect(env).toBeDefined();
});
