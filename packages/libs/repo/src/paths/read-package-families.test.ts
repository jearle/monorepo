import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';

import { expect, test } from 'bun:test';

import {
  PATHS_RESULT_STATUS_SUCCESS,
  findRepoRoot,
  readPackageFamilies,
} from '.';

test(`readPackageFamilies({ repoRoot }) reads package directories`, async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), `monorepo-lib-repo-`));

  try {
    const packagesPath = path.join(repoRoot, `packages`);
    await mkdir(path.join(packagesPath, `apis`), { recursive: true });
    await mkdir(path.join(packagesPath, `clis`), { recursive: true });
    await mkdir(path.join(packagesPath, `libs`), { recursive: true });
    await mkdir(path.join(packagesPath, `schemas`), { recursive: true });
    await mkdir(path.join(packagesPath, `services`), { recursive: true });
    await mkdir(path.join(packagesPath, `.turbo`), { recursive: true });
    await writeFile(path.join(repoRoot, `package.json`), `{}`);

    const readPackageFamiliesResult = await readPackageFamilies({ repoRoot });
    const findRepoRootResult = await findRepoRoot({
      startPath: path.join(packagesPath, `libs`),
    });
    expect(readPackageFamiliesResult.status).toBe(PATHS_RESULT_STATUS_SUCCESS);
    expect(findRepoRootResult.status).toBe(PATHS_RESULT_STATUS_SUCCESS);

    if (
      readPackageFamiliesResult.status !== PATHS_RESULT_STATUS_SUCCESS ||
      findRepoRootResult.status !== PATHS_RESULT_STATUS_SUCCESS
    ) {
      expect.unreachable();
    }

    const { packageFamilies } = readPackageFamiliesResult.data;
    const { repoRoot: foundRepoRoot } = findRepoRootResult.data;

    expect(packageFamilies).toEqual([
      `apis`,
      `clis`,
      `libs`,
      `schemas`,
      `services`,
    ]);
    expect(foundRepoRoot).toBe(repoRoot);
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
