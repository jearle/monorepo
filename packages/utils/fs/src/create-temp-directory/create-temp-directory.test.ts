import { mkdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';

import { createTempDirectory } from '.';

test(`createTempDirectory() creates a prefixed temp directory`, async () => {
  const directoryPath = await createTempDirectory({
    prefix: `monorepo-fs-test-`,
  });

  try {
    const directoryStats = await stat(directoryPath);
    const directoryName = path.basename(directoryPath);

    expect(directoryStats.isDirectory()).toBe(true);
    expect(directoryName.startsWith(`monorepo-fs-test-`)).toBe(true);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`createTempDirectory() creates a temp directory under a parent`, async () => {
  const parentDirectoryPath = path.join(tmpdir(), `monorepo-fs-parent-test`);

  await rm(parentDirectoryPath, { recursive: true, force: true });
  await mkdir(parentDirectoryPath);

  const directoryPath = await createTempDirectory({
    parentDirectoryPath,
    prefix: `nested-`,
  });

  try {
    expect(path.dirname(directoryPath)).toBe(parentDirectoryPath);
    expect(path.basename(directoryPath).startsWith(`nested-`)).toBe(true);
  } finally {
    await rm(parentDirectoryPath, { recursive: true, force: true });
  }
});
