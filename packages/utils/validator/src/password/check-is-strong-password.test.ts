import { expect, test } from 'bun:test';

import { STRONG_PASSWORD, WEAK_PASSWORD } from './constants-test';
import { checkIsStrongPassword } from '.';

test(`checkIsStrongPassword(STRONG_PASSWORD)`, () => {
  const isStrongPassword = checkIsStrongPassword(STRONG_PASSWORD);

  expect(isStrongPassword).toBeTrue();
});

test(`checkIsStrongPassword(WEAK_PASSWORD)`, () => {
  const isStrongPassword = checkIsStrongPassword(WEAK_PASSWORD);

  expect(isStrongPassword).toBeFalse();
});
