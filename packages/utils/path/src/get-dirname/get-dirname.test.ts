import { test, expect } from 'bun:test';

import { getDirname } from './get-dirname';

test(`getDirname(import.meta.url)`, () => {
  const dirname = getDirname(import.meta.url);

  expect(dirname).toEndWith(`get-dirname`);
});
