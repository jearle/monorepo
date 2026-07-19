import { expect, test } from 'bun:test';

import { __SkeletonSchema } from '.';

test(`__SkeletonSchema parses valid data`, () => {
  const result = __SkeletonSchema.parse({ value: `example` });

  expect(result).toEqual({ value: `example` });
});
