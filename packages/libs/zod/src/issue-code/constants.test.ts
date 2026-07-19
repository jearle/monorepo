import { expect, test } from 'bun:test';

import { ZOD_ISSUE_CODE_CUSTOM } from '.';

test(`exports custom issue code value`, () => {
  expect(ZOD_ISSUE_CODE_CUSTOM).toBe(`custom`);
});
