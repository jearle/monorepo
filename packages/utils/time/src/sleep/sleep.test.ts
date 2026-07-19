import { expect, test } from 'bun:test';

import { sleep } from '.';

test(`sleep({ delayMs }) resolves immediately for non-positive delays`, async () => {
  const zeroDelayResult = await sleep({ delayMs: 0 });
  const negativeDelayResult = await sleep({ delayMs: -1 });

  expect(zeroDelayResult).toBeUndefined();
  expect(negativeDelayResult).toBeUndefined();
});

test(`sleep({ delayMs }) resolves asynchronously for positive delays`, async () => {
  let isResolved = false;
  const sleepPromise = sleep({ delayMs: 1 }).then(() => {
    isResolved = true;
  });

  expect(isResolved).toBe(false);

  await sleepPromise;

  expect(isResolved).toBe(true);
});

test(`sleep({ signal }) rejects when the signal is already aborted`, async () => {
  const controller = new AbortController();
  const abortReason = new Error(`cancelled`);
  controller.abort(abortReason);

  await expect(
    sleep({
      delayMs: 1,
      signal: controller.signal,
    }),
  ).rejects.toBe(abortReason);
});

test(`sleep({ signal }) rejects when the signal aborts during sleep`, async () => {
  const controller = new AbortController();
  const abortReason = new Error(`cancelled`);
  const sleepPromise = sleep({
    delayMs: 10,
    signal: controller.signal,
  });

  controller.abort(abortReason);

  await expect(sleepPromise).rejects.toBe(abortReason);
});
