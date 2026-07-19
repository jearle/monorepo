import { expect, test } from 'bun:test';

import { checkIsCSVExportInput } from '.';

test(`checkIsCSVExportInput accepts row arrays`, () => {
  const isCSVExportInput = checkIsCSVExportInput([
    { name: `Ada`, active: true },
  ]);

  expect(isCSVExportInput).toBeTrue();
});

test(`checkIsCSVExportInput accepts fields and data objects`, () => {
  const isCSVExportInput = checkIsCSVExportInput({
    data: [[`Ada`, true]],
    fields: [`name`, `active`],
  });

  expect(isCSVExportInput).toBeTrue();
});

test(`checkIsCSVExportInput rejects unsupported row values`, () => {
  const isCSVExportInput = checkIsCSVExportInput([{ nested: { value: true } }]);

  expect(isCSVExportInput).toBeFalse();
});

test(`checkIsCSVExportInput rejects mixed row shapes`, () => {
  const isCSVExportInput = checkIsCSVExportInput([{ a: 1 }, [2]]);

  expect(isCSVExportInput).toBeFalse();
});

test(`checkIsCSVExportInput rejects non-plain object rows`, () => {
  const isCSVExportInput = checkIsCSVExportInput([new Date(0)]);

  expect(isCSVExportInput).toBeFalse();
});
