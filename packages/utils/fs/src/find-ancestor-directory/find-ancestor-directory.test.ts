import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';
import { RESULT_STATUS_ERROR, RESULT_STATUS_SUCCESS } from '@jearle/util-result';

import {
  type CheckIsAncestorDirectoryProps,
  findAncestorDirectory,
  getPathExists,
} from '..';

test(`findAncestorDirectory({ startPath, checkIsAncestorDirectory }) returns the first matching ancestor`, async () => {
  const rootPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    const startPath = path.join(rootPath, `a`, `b`, `c`);
    const markerPath = path.join(rootPath, `a`, `marker.txt`);
    await mkdir(startPath, { recursive: true });
    await writeFile(markerPath, `marker`);

    const result = await findAncestorDirectory({
      startPath,
      checkIsAncestorDirectory: async (
        props: CheckIsAncestorDirectoryProps,
      ) => {
        const { directoryPath } = props;
        const result = await getPathExists({
          path: path.join(directoryPath, `marker.txt`),
        });

        return result;
      },
    });

    expect(result).toEqual({
      status: RESULT_STATUS_SUCCESS,
      data: path.join(rootPath, `a`),
    });
  } finally {
    await rm(rootPath, { recursive: true, force: true });
  }
});

test(`findAncestorDirectory({ startPath, checkIsAncestorDirectory }) returns null for no match`, async () => {
  const rootPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    const result = await findAncestorDirectory({
      startPath: rootPath,
      checkIsAncestorDirectory: () => false,
    });

    expect(result).toEqual({
      status: RESULT_STATUS_SUCCESS,
      data: null,
    });
  } finally {
    await rm(rootPath, { recursive: true, force: true });
  }
});

test(`findAncestorDirectory({ startPath, checkIsAncestorDirectory }) returns errors`, async () => {
  const rootPath = await mkdtemp(path.join(tmpdir(), `monorepo-util-fs-`));

  try {
    const result = await findAncestorDirectory({
      startPath: rootPath,
      checkIsAncestorDirectory: () => {
        throw new Error(`failed`);
      },
    });

    expect(result.status).toBe(RESULT_STATUS_ERROR);

    if (result.status === RESULT_STATUS_SUCCESS) {
      expect.unreachable();
    }

    expect(result.error.message).toBe(`failed`);
  } finally {
    await rm(rootPath, { recursive: true, force: true });
  }
});
