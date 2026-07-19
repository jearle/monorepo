import { expect, test } from 'bun:test';

import { readRootPackageJson } from './read-root-package-json';
import { resolveTestRepoRoot } from './resolve-test-repo-root';

test(`keeps root tooling scripts as Monorepo repo CLI delegates`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const packageJsonResult = readRootPackageJson(repoRoot);

  expect(packageJsonResult.success).toBe(true);

  if (packageJsonResult.success === false) {
    return;
  }

  expect(packageJsonResult.packageJson.scripts).toMatchObject({
    compile: `bun run repo compile`,
    format: `bun run repo format`,
    lint: `bun run repo lint`,
    test: `bun run repo test`,
    verify: `bun run repo verify`,
    [`verify:deps`]: `bun run repo verify deps`,
    [`verify:package-exports`]: `bun run repo verify package-exports`,
    [`verify:package-scripts`]: `bun run repo verify package-scripts`,
  });
});
