import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';

import { expect, test } from 'bun:test';

import { SKELETON_RESULT_STATUS_SUCCESS, createSkeletonPackage } from '.';

test(`createSkeletonPackage({ repoRoot, packageFamily, name }) copies and replaces a template`, async () => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), `monorepo-lib-repo-`));

  try {
    const templatePath = path.join(repoRoot, `packages`, `clis`, `__skeleton`);
    const templateCommandPath = path.join(
      templatePath,
      `src`,
      `__skeleton-command`,
    );
    await mkdir(templateCommandPath, { recursive: true });
    await writeFile(path.join(repoRoot, `package.json`), `{}`);
    await writeFile(
      path.join(templatePath, `package.json`),
      `{"name":"@jearle/cli-__skeleton"}`,
    );
    await writeFile(
      path.join(templatePath, `.env.example`),
      `NODE_ENV=development\nLOG_LEVEL=info`,
    );
    await writeFile(
      path.join(templateCommandPath, `create-__skeleton-command.ts`),
      `export const command = "create__skeletonCommand COMMAND___SKELETON";`,
    );

    const result = await createSkeletonPackage({
      repoRoot,
      packageFamily: `clis`,
      name: `behavior-datasets`,
    });
    expect(result.status).toBe(SKELETON_RESULT_STATUS_SUCCESS);

    if (result.status !== SKELETON_RESULT_STATUS_SUCCESS) {
      expect.unreachable();
    }

    const { skeletonPackage } = result.data;

    const targetPackageJsonPath = path.join(
      repoRoot,
      `packages`,
      `clis`,
      `behavior-datasets`,
      `package.json`,
    );
    const targetCommandPath = path.join(
      repoRoot,
      `packages`,
      `clis`,
      `behavior-datasets`,
      `src`,
      `behavior-datasets-command`,
      `create-behavior-datasets-command.ts`,
    );
    const targetEnvExamplePath = path.join(
      repoRoot,
      `packages`,
      `clis`,
      `behavior-datasets`,
      `.env.example`,
    );
    const packageJson = await readFile(targetPackageJsonPath, `utf8`);
    const commandFile = await readFile(targetCommandPath, `utf8`);
    const envExample = await readFile(targetEnvExamplePath, `utf8`);

    expect(skeletonPackage.relativeSourcePath).toBe(`packages/clis/__skeleton`);
    expect(skeletonPackage.relativeTargetPath).toBe(
      `packages/clis/behavior-datasets`,
    );
    expect(packageJson).toBe(`{"name":"@jearle/cli-behavior-datasets"}`);
    expect(envExample).toBe(`NODE_ENV=development\nLOG_LEVEL=info`);
    expect(commandFile).toBe(
      `export const command = "createBehaviorDatasetsCommand COMMAND_BEHAVIOR_DATASETS";`,
    );
  } finally {
    await rm(repoRoot, { recursive: true, force: true });
  }
});
