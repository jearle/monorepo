import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';

import { expect, test } from 'bun:test';

import {
  PATHS_RESULT_STATUS_SUCCESS,
  readPackageNames,
  resolvePackagePath,
} from '.';

test(`readPackageNames({ repoRoot, packageFamily }) reads packages`, async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), `monorepo-lib-repo-`));

  try {
    const familyPath = path.join(repoRoot, `packages`, `clis`);
    await mkdir(path.join(familyPath, `__skeleton`), { recursive: true });
    await mkdir(path.join(familyPath, `repo`), { recursive: true });
    await mkdir(path.join(familyPath, `.turbo`), { recursive: true });

    const readPackageNamesResult = await readPackageNames({
      repoRoot,
      packageFamily: `clis`,
    });
    expect(readPackageNamesResult.status).toBe(PATHS_RESULT_STATUS_SUCCESS);

    if (readPackageNamesResult.status !== PATHS_RESULT_STATUS_SUCCESS) {
      expect.unreachable();
    }

    const { packageNames } = readPackageNamesResult.data;
    const { packagePath } = resolvePackagePath({
      repoRoot,
      packageFamily: `clis`,
      packageName: `repo`,
    });

    expect(packageNames).toEqual([`__skeleton`, `repo`]);
    expect(packagePath).toBe(path.join(familyPath, `repo`));
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
