import { expect, test } from 'bun:test';

import { getBackoffDelay } from '.';

test(`getBackoffDelay({ retryIndex: 0 }) returns the initial delay`, () => {
  const result = getBackoffDelay({
    initialDelayMs: 500,
    retryIndex: 0,
  });

  expect(result).toBe(500);
});

test(`getBackoffDelay({ multiplier }) returns an exponential delay`, () => {
  const result = getBackoffDelay({
    initialDelayMs: 500,
    multiplier: 2,
    retryIndex: 3,
  });

  expect(result).toBe(4_000);
});

test(`getBackoffDelay({ maxDelayMs }) caps the delay`, () => {
  const result = getBackoffDelay({
    initialDelayMs: 500,
    maxDelayMs: 1_000,
    multiplier: 2,
    retryIndex: 3,
  });

  expect(result).toBe(1_000);
});

test(`getBackoffDelay({ jitter }) returns a full-jitter delay`, () => {
  const result = getBackoffDelay({
    initialDelayMs: 500,
    jitter: true,
    multiplier: 2,
    random: () => 0.5,
    retryIndex: 3,
  });

  expect(result).toBe(2_000);
});

test(`getBackoffDelay({ retryIndex }) caps to the default max delay`, () => {
  const result = getBackoffDelay({
    initialDelayMs: 1_000,
    multiplier: 2,
    retryIndex: 20,
  });

  expect(result).toBe(30_000);
});

test(`getBackoffDelay({ maxDelayMs: Infinity }) allows uncapped delays`, () => {
  const result = getBackoffDelay({
    initialDelayMs: 1_000,
    maxDelayMs: Infinity,
    multiplier: 2,
    retryIndex: 20,
  });

  expect(result).toBe(1_048_576_000);
});

test(`getBackoffDelay({ maxDelayMs, jitter }) jitters the capped delay`, () => {
  const result = getBackoffDelay({
    initialDelayMs: 1_000,
    jitter: true,
    maxDelayMs: 10_000,
    multiplier: 2,
    random: () => 0.5,
    retryIndex: 20,
  });

  expect(result).toBe(5_000);
});
