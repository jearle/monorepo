import { expect, test } from 'bun:test';

import { create__skeleton } from '.';

test(`create__skeleton() returns API metadata`, () => {
  const result = create__skeleton();

  expect(result.name).toBe(`__skeleton-api`);
});
