import { expect, test } from 'bun:test';

import { createWorkflowResult } from '../workflow-result';
import { verify } from '.';
import { resolveTestRepoRoot } from './resolve-test-repo-root';
import { type CapturedCommand } from './verify-test-helper-types';

type CapturedVerifyPackageExportsCall = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};

type CapturedVerifyPackageScriptsCall = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};

test(`runs scoped verify against affected workspace tools`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];
  const verifyPackageExportsCalls: CapturedVerifyPackageExportsCall[] = [];
  const verifyPackageScriptsCalls: CapturedVerifyPackageScriptsCall[] = [];

  type RunCommandProps = CapturedCommand;
  type VerifyPackageExportsProps = CapturedVerifyPackageExportsCall;
  type VerifyPackageScriptsProps = CapturedVerifyPackageScriptsCall;

  const result = await verify(
    {
      cwd: repoRoot,
      filePaths: [`packages/clis/repo/src/main.ts`],
    },
    {
      runCommand: (props: RunCommandProps) => {
        commands.push(props);
        return 0;
      },
      verifyPackageExports: async (props: VerifyPackageExportsProps) => {
        verifyPackageExportsCalls.push(props);

        const result = createWorkflowResult({ exitCode: 0 });
        return result;
      },
      verifyPackageScripts: async (props: VerifyPackageScriptsProps) => {
        verifyPackageScriptsCalls.push(props);

        const result = createWorkflowResult({ exitCode: 0 });
        return result;
      },
    },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([
    {
      args: [
        `bunx`,
        `oxlint`,
        `packages/clis/repo/src/main.ts`,
        `--config`,
        `packages/configs/oxlint/.oxlintrc.json`,
        `--no-error-on-unmatched-pattern`,
      ],
      cwd: repoRoot,
      label: `oxlint staged files`,
    },
    {
      args: [`bunx`, `turbo`, `run`, `compile`, `--filter=@jearle/cli-repo`],
      cwd: repoRoot,
      label: `compile staged workspaces`,
    },
    {
      args: [
        `bunx`,
        `knip`,
        `--include`,
        `binaries,catalog,unlisted,unresolved`,
        `--no-progress`,
        `--no-config-hints`,
        `--workspace`,
        `@jearle/cli-repo`,
      ],
      cwd: repoRoot,
      label: `knip staged workspaces`,
    },
  ]);
  expect(verifyPackageExportsCalls).toEqual([
    {
      cwd: repoRoot,
      filePaths: [`packages/clis/repo/src/main.ts`],
    },
  ]);
  expect(verifyPackageScriptsCalls).toEqual([
    {
      cwd: repoRoot,
      filePaths: [`packages/clis/repo/src/main.ts`],
    },
  ]);
});
