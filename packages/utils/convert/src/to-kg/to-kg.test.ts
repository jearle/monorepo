import { test, expect } from 'bun:test';

import { toKG } from './to-kg.ts';

test(`toKG`, () => {
  const kg = toKG(2.2);

  expect(kg).toBe(1);
});

test(`toKG { unit }`, () => {
  const kg = toKG(35.2, { unit: `ounce` });

  expect(kg).toBe(1);
});
