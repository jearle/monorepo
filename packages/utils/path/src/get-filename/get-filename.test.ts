import { test, expect } from 'bun:test';

import { getFilename } from './get-filename';

test(`getFilename(import.meta.url)`, () => {
  const filename = getFilename(import.meta.url);

  expect(filename).toEndWith(`get-filename.test.ts`);
});
