import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_ERROR, RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { readDirectoryEntries } from '..';

test(`readDirectoryEntries({ directoryPath }) returns directory entries`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    await mkdir(path.join(directoryPath, `child`));
    await writeFile(path.join(directoryPath, `file.txt`), `hello`);

    const result = await readDirectoryEntries({ directoryPath });

    expect(result.status).toBe(RESULT_STATUS_SUCCESS);

    if (result.status === RESULT_STATUS_ERROR) {
      expect.unreachable();
    }

    const names = result.data.map((entry) => entry.name).sort();

    expect(names).toEqual([`child`, `file.txt`]);
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`readDirectoryEntries({ directoryPath }) returns errors`, async () => {
  const directoryPath = path.join(tmpdir(), `monorepo-util-fs-missing`);
  const result = await readDirectoryEntries({ directoryPath });

  expect(result.status).toBe(RESULT_STATUS_ERROR);

  if (result.status === RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  expect(result.error.message.length).toBeGreaterThan(0);
});
