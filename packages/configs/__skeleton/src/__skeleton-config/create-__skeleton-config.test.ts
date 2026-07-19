import { expect, test } from 'bun:test';

import { create__skeletonConfig } from '.';

test(`create__skeletonConfig() returns config metadata`, () => {
  const result = create__skeletonConfig();

  expect(result.name).toBe(`__skeleton`);
});
