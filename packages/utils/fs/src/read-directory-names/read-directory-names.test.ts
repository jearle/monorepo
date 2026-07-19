import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_ERROR, RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import { readDirectoryNames } from '..';

test(`readDirectoryNames({ directoryPath }) returns sorted visible directory names`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    await mkdir(path.join(directoryPath, `zulu`));
    await mkdir(path.join(directoryPath, `alpha`));
    await mkdir(path.join(directoryPath, `.hidden`));
    await mkdir(path.join(directoryPath, `node_modules`));
    await writeFile(path.join(directoryPath, `file.txt`), `hello`);

    const result = await readDirectoryNames({
      directoryPath,
      ignoredNames: [`node_modules`],
    });

    expect(result).toEqual({
      status: RESULT_STATUS_SUCCESS,
      data: [`alpha`, `zulu`],
    });
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`readDirectoryNames({ directoryPath, includeHidden }) includes hidden directories`, async () => {
  const directoryPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    await mkdir(path.join(directoryPath, `.hidden`));

    const result = await readDirectoryNames({
      directoryPath,
      includeHidden: true,
    });

    expect(result).toEqual({
      status: RESULT_STATUS_SUCCESS,
      data: [`.hidden`],
    });
  } finally {
    await rm(directoryPath, { recursive: true, force: true });
  }
});

test(`readDirectoryNames({ directoryPath }) returns errors`, async () => {
  const directoryPath = path.join(tmpdir(), `monorepo-util-fs-missing`);
  const result = await readDirectoryNames({ directoryPath });

  expect(result.status).toBe(RESULT_STATUS_ERROR);

  if (result.status === RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  expect(result.error.message.length).toBeGreaterThan(0);
});
