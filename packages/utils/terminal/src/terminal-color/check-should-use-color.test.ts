import { expect, test } from 'bun:test';

import { checkShouldUseColor } from '.';

test(`checkShouldUseColor respects terminal color environment`, () => {
  expect(checkShouldUseColor({ env: {}, isTTY: true })).toBe(true);
  expect(checkShouldUseColor({ env: {}, isTTY: false })).toBe(false);
  expect(checkShouldUseColor({ env: { NO_COLOR: `1` }, isTTY: true })).toBe(
    false,
  );
  expect(checkShouldUseColor({ env: { FORCE_COLOR: `1` }, isTTY: false })).toBe(
    true,
  );
  expect(checkShouldUseColor({ env: { FORCE_COLOR: `0` }, isTTY: true })).toBe(
    false,
  );
});
