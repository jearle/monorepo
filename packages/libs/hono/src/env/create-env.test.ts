import { expect, test } from 'bun:test';

import { createEnv } from './create-env';

test(`createEnv()`, () => {
  const { env } = createEnv();

  expect(env).toBeDefined();
});
