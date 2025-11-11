import { test, expect } from 'bun:test';

import { toJSON } from './to-json';

const TEST_CSV = `Header 1,Header 2
item 1,item 2`;

test(`toJSON`, () => {
  const { json } = toJSON({ csv: TEST_CSV, config: { header: true } });

  const [{ [`Header 1`]: item1, [`Header 2`]: item2 }] = json;

  expect(item1).toEqual(`item 1`);
  expect(item2).toEqual(`item 2`);
});
