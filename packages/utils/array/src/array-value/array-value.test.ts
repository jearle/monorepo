import { expect, test } from 'bun:test';
import { RESULT_STATUS_ERROR, RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { getArrayValue, getLastArrayValue } from '.';

test(`getArrayValue({ values, index }) returns the indexed value`, () => {
  const result = getArrayValue({
    values: [`alpha`, `beta`],
    index: 1,
  });

  expect(result).toEqual({
    status: RESULT_STATUS_SUCCESS,
    data: `beta`,
  });
});

test(`getArrayValue({ values, index }) returns an error for a missing value`, () => {
  const result = getArrayValue({
    values: [`alpha`],
    index: 1,
  });

  expect(result.status).toBe(RESULT_STATUS_ERROR);

  if (result.status !== RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  expect(result.error.message).toBe(`Expected array value at index 1.`);
});

test(`getLastArrayValue({ values }) returns the final value`, () => {
  const result = getLastArrayValue({
    values: [`alpha`, `beta`],
  });

  expect(result).toEqual({
    status: RESULT_STATUS_SUCCESS,
    data: `beta`,
  });
});
