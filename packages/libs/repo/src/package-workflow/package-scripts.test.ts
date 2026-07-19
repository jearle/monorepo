import { expect, test } from 'bun:test';

import { PATHS_RESULT_STATUS_ERROR, findRepoRoot } from '../paths';
import { readWorkspacePackages } from '../workspace';

const expectedToolingScripts = {
  compile: `bun run repo package compile`,
  format: `bun run repo package format`,
  lint: `bun run repo package lint`,
  [`lint:style`]: `bun run repo package lint-style`,
  test: `bun run repo package test`,
  verify: `bun run repo package verify`,
} as const;

const childOnlyRepoScriptNames = new Set([`verify:package-exports`]);

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

test(`keeps child package tooling scripts as package repo command delegates`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const packageInfos = readWorkspacePackages({ repoRoot });
  const violations = packageInfos.flatMap((packageInfo) => {
    const scripts = packageInfo.packageJson.scripts ?? {};
    const toolingViolations = Object.entries(expectedToolingScripts).flatMap(
      ([scriptName, expectedScript]) => {
        const script = scripts[scriptName];

        if (script === undefined || script === expectedScript) {
          return [];
        }

        return [
          `${packageInfo.relativeDirectory} ${scriptName}: expected ${expectedScript}, found ${script}`,
        ];
      },
    );
    const childOnlyScriptViolations = Object.keys(scripts).flatMap(
      (scriptName) => {
        const isChildOnlyRepoScript = childOnlyRepoScriptNames.has(scriptName);

        if (isChildOnlyRepoScript === false) {
          return [];
        }

        return [
          `${packageInfo.relativeDirectory} ${scriptName}: root-only repo script`,
        ];
      },
    );
    const buildScript = scripts[`build`];
    const buildViolations =
      buildScript !== undefined && buildScript.includes(`tsc -b`)
        ? [
            `${packageInfo.relativeDirectory} build: direct package compile command`,
          ]
        : [];
    const result = [
      ...toolingViolations,
      ...childOnlyScriptViolations,
      ...buildViolations,
    ];

    return result;
  });

  expect(violations).toEqual([]);
});
