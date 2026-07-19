import { expect, test } from 'bun:test';

import { toJSON } from '.';

const TEST_CSV = `Header 1,Header 2
item 1,item 2`;

test(`toJSON`, () => {
  const { errors, json } = toJSON(TEST_CSV, { header: true });

  const [{ [`Header 1`]: item1, [`Header 2`]: item2 }] = json;

  expect(errors).toEqual([]);
  expect(item1).toEqual(`item 1`);
  expect(item2).toEqual(`item 2`);
});

test(`toJSON returns parser errors`, () => {
  const { errors } = toJSON(`name\n"unterminated`);

  expect(errors.length).toBeGreaterThan(0);
});
