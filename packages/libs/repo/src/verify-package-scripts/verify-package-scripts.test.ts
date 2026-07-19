import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { expect, test } from 'bun:test';

import { PATHS_RESULT_STATUS_ERROR, findRepoRoot } from '../paths';
import {
  WORKFLOW_RESULT_STATUS_ERROR,
  WORKFLOW_RESULT_STATUS_SUCCESS,
} from '../workflow-result';
import { verifyPackageScripts } from '.';

const resolveTestRepoRoot = async () => {
  const findRepoRootResult = await findRepoRoot({ startPath: process.cwd() });
  const hasError = findRepoRootResult.status === PATHS_RESULT_STATUS_ERROR;

  if (hasError) {
    const { error } = findRepoRootResult;

    throw error;
  }

  const { repoRoot } = findRepoRootResult.data;
  return repoRoot;
};

test(`verifyPackageScripts validates workspace package script surfaces`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const result = await verifyPackageScripts({
    cwd: repoRoot,
    filePaths: [],
  });

  expect(result.status).toBe(WORKFLOW_RESULT_STATUS_SUCCESS);
  expect(result.exitCode).toBe(0);
});

test(`verifyPackageScripts rejects direct package tooling binaries`, async () => {
  const repoRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), `monorepo-package-scripts-test-`),
  );
  const packageDirectory = path.join(repoRoot, `packages`, `utils`, `bad`);
  const sourceDirectory = path.join(packageDirectory, `src`);
  const packageJsonPath = path.join(packageDirectory, `package.json`);

  fs.mkdirSync(sourceDirectory, { recursive: true });
  fs.writeFileSync(path.join(repoRoot, `package.json`), `{"private":true}\n`);
  fs.writeFileSync(path.join(sourceDirectory, `index.ts`), ``);
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      {
        name: `@jearle/util-bad`,
        scripts: {
          format: `bun run repo package format`,
          compile: `bun run repo package compile`,
          lint: `bun run repo package lint`,
          verify: `bun run repo package verify`,
          check: `tsc -b && oxlint .`,
        },
      },
      null,
      2,
    ),
  );

  const result = await verifyPackageScripts({
    cwd: repoRoot,
    filePaths: [],
  });

  expect(result.status).toBe(WORKFLOW_RESULT_STATUS_ERROR);
  expect(result.exitCode).toBe(1);
});
