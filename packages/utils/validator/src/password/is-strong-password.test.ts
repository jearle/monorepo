import { test, expect } from 'bun:test';

import { STRONG_PASSWORD, WEAK_PASSWORD } from './constants-test';
import { determineIsStrongPassword } from './determine-is-strong-password';

test(`determineIsStrongPassword(STRONG_PASSWORD)`, () => {
  const isStrongPassword = determineIsStrongPassword(STRONG_PASSWORD);
  console.log(isStrongPassword);
  expect(isStrongPassword).toBeTrue();
});

test(`determineIsStrongPassword(WEAK_PASSWORD)`, () => {
  const isStrongPassword = determineIsStrongPassword(WEAK_PASSWORD);
  console.log(isStrongPassword);
  expect(isStrongPassword).toBeFalse();
});
