import { expect, test } from 'bun:test';

import { create__skeleton } from '.';

test(`create__skeleton()`, () => {
  const result = create__skeleton({ value: `ok` });

  expect(result.value).toBe(`ok`);
});
