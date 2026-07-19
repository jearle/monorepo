import { expect, test } from 'bun:test';

import { formatTerminalCommandPrefix } from '.';

test(`formatTerminalCommandPrefix formats labels and commands`, () => {
  expect(
    formatTerminalCommandPrefix({
      command: `bun test`,
      label: `tests`,
      shouldUseColor: false,
    }),
  ).toBe(`\ntests\n$ bun test\n`);

  expect(
    formatTerminalCommandPrefix({
      command: `bun test`,
      label: `tests`,
      shouldPrintCommand: false,
      shouldUseColor: false,
    }),
  ).toBe(`\ntests\n`);
});
