import { round } from './round.js';

// src/round/round.test.ts
import { test, expect } from 'bun:test';
test(`round`, () => {
  const valueRound = round(0.615);
  expect(valueRound).toBe(0.62);
});
test(`round { precision }`, () => {
  const valueRound = round(0.615, { precision: 3 });
  expect(valueRound).toBe(0.615);
});
