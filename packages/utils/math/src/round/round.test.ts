import { expect, test } from 'bun:test';

import { round } from '.';

test(`rounds to two decimal places by default`, () => {
  const roundedValue = round(0.615);

  expect(roundedValue).toBe(0.62);
});

test(`rounds to the requested precision`, () => {
  const roundedValue = round(1.2345, {
    precision: 3,
  });

  expect(roundedValue).toBe(1.235);
});
