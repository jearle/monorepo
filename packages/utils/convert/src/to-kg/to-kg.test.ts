import { expect, test } from 'bun:test';

import { toKG } from '.';

test(`toKG({ value })`, () => {
  const kilograms = toKG(2.2);

  expect(kilograms).toBe(1);
});

test(`toKG({ value, unit })`, () => {
  const kilograms = toKG(35.2, {
    unit: `ounce`,
  });

  expect(kilograms).toBe(1);
});
