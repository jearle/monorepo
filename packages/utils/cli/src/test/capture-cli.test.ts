import { expect, test } from 'bun:test';

import { captureCLI } from '.';

test(`captureCLI captures stdout, stderr, and exit code`, async () => {
  const result = await captureCLI({
    run: async () => {
      process.stdout.write(`out`);
      process.stderr.write(`err`);
      process.exitCode = 1;
    },
  });

  expect(result).toEqual({
    exitCode: 1,
    stderr: `err`,
    stdout: `out`,
  });
});
