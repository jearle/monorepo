import { expect, test } from 'bun:test';

import { toCSV } from '.';

test(`toCSV exports JSON rows`, () => {
  const { csv } = toCSV({
    json: [
      {
        name: `Ada`,
        role: `engineer`,
      },
    ],
  });

  expect(csv).toContain(`name,role`);
  expect(csv).toContain(`Ada,engineer`);
});

test(`toCSV exports field arrays`, () => {
  const { csv } = toCSV({
    json: {
      fields: [`name`, `role`],
      data: [[`Ada`, `engineer`]],
    },
  });

  expect(csv).toContain(`name,role`);
  expect(csv).toContain(`Ada,engineer`);
});

test(`toCSV accepts empty row arrays`, () => {
  const { csv } = toCSV({
    json: [],
  });

  expect(csv).toBe(``);
});
