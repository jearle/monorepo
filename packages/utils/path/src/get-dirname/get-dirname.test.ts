import { expect, test } from 'bun:test';

import { getDirname } from '.';

test(`getDirname(import.meta.url)`, () => {
  const dirname = getDirname(import.meta.url);

  expect(dirname).toEndWith(`get-dirname`);
});
