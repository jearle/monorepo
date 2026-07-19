import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';

import { getPathExists } from '..';

test(`getPathExists({ path }) returns true for an existing path`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    const filePath = path.join(directoryPath, `file.txt`);
    await writeFile(filePath, `hello`);

    const result = await getPathExists({ path: filePath });

    expect(result).toBe(true);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`getPathExists({ path }) returns false for a missing path`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    const filePath = path.join(directoryPath, `missing.txt`);
    const result = await getPathExists({ path: filePath });

    expect(result).toBe(false);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});
