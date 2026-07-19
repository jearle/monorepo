import { expect, test } from 'bun:test';

import { createTerminalColorizer } from '.';

test(`createTerminalColorizer colorizes only when enabled`, () => {
  const colorizer = createTerminalColorizer({ shouldUseColor: true });
  const plainColorizer = createTerminalColorizer({ shouldUseColor: false });

  expect(colorizer.bold(`label`)).not.toBe(`label`);
  expect(plainColorizer.bold(`label`)).toBe(`label`);
});
