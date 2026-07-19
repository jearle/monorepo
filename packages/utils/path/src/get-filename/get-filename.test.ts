import { expect, test } from 'bun:test';

import { getFilename } from '.';

test(`getFilename(import.meta.url)`, () => {
  const filename = getFilename(import.meta.url);

  expect(filename).toEndWith(`get-filename.test.ts`);
});
