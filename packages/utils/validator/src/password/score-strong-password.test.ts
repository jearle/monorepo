import { test, expect } from 'bun:test';

import { STRONG_PASSWORD, WEAK_PASSWORD } from './constants-test';
import { STRONG_PASSWORD_THRESHOLD } from './constants';
import { scoreStrongPassword } from './score-strong-password';

test(`scoreStrongPassword(STRONG_PASSWORD)`, () => {
  const strongPasswordScore = scoreStrongPassword(STRONG_PASSWORD);
  expect(strongPasswordScore).toBeGreaterThanOrEqual(STRONG_PASSWORD_THRESHOLD);
});

test(`scoreStrongPassword(STRONG_PASSWORD)`, () => {
  const strongPasswordScore = scoreStrongPassword(WEAK_PASSWORD);
  expect(strongPasswordScore).toBeLessThan(STRONG_PASSWORD_THRESHOLD);
});
