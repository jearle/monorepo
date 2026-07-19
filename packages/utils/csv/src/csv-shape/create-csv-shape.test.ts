import { expect, test } from 'bun:test';

import { createCSVShape } from '.';

test(`createCSVShape reports rows and inferred columns`, () => {
  const shape = createCSVShape({
    rows: [
      [`Ada`, `engineer`],
      [`Grace`, `scientist`, `compiler`],
    ],
  });

  expect(shape).toEqual({
    columnCount: 3,
    rowCount: 2,
  });
});

test(`createCSVShape uses header columns when supplied`, () => {
  const shape = createCSVShape({
    columns: [`name`, `role`],
    rows: [{ name: `Ada`, role: `engineer` }],
  });

  expect(shape).toEqual({
    columnCount: 2,
    columns: [`name`, `role`],
    rowCount: 1,
  });
});
