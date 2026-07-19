import path from 'node:path';

import { PATHS_RESULT_STATUS_ERROR, findRepoRoot } from '../paths';
import { verifyPackageExports } from '.';
import { expect, test } from 'bun:test';

type CapturedCommand = {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly label?: string;
  readonly printCommand?: boolean;
  readonly printSuccessOutput?: boolean;
};

type RunCommandProps = CapturedCommand;

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

test(`runs scoped package export checks for versioned exported packages`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];
  const packageDirectory = path.join(repoRoot, `packages/apis/health`);

  const result = await verifyPackageExports(
    {
      cwd: repoRoot,
      filePaths: [`packages/apis/health/src/main.ts`],
    },
    {
      runCommand: async (props: RunCommandProps) => {
        commands.push(props);
        return { exitCode: 0 };
      },
    },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([
    {
      args: [`bunx`, `publint`, `run`, `.`, `--pack`, `false`, `--strict`],
      cwd: packageDirectory,
      label: `publint @jearle/api-health (packages/apis/health)`,
      printSuccessOutput: false,
    },
    {
      args: [
        `bunx`,
        `attw`,
        `.`,
        `--pack`,
        `--format`,
        `table`,
        `--profile`,
        `esm-only`,
        `--quiet`,
        `--ignore-rules`,
        `no-resolution`,
        `internal-resolution-error`,
      ],
      cwd: packageDirectory,
      label: `attw @jearle/api-health (packages/apis/health)`,
      printSuccessOutput: false,
    },
  ]);
});

test(`runs package export checks for exported schema packages`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];
  const packageDirectory = path.join(repoRoot, `packages/schemas/result`);
  const result = await verifyPackageExports(
    {
      cwd: repoRoot,
      filePaths: [`packages/schemas/result/src/index.ts`],
    },
    {
      runCommand: async (props: RunCommandProps) => {
        commands.push(props);
        return { exitCode: 0 };
      },
    },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([
    {
      args: [`bunx`, `publint`, `run`, `.`, `--pack`, `false`, `--strict`],
      cwd: packageDirectory,
      label: `publint @jearle/schema-result (packages/schemas/result)`,
      printSuccessOutput: false,
    },
    {
      args: [
        `bunx`,
        `attw`,
        `.`,
        `--pack`,
        `--format`,
        `table`,
        `--profile`,
        `esm-only`,
        `--quiet`,
        `--ignore-rules`,
        `no-resolution`,
        `internal-resolution-error`,
      ],
      cwd: packageDirectory,
      label: `attw @jearle/schema-result (packages/schemas/result)`,
      printSuccessOutput: false,
    },
  ]);
});

test(`skips private package export workspaces`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];
  const result = await verifyPackageExports(
    {
      cwd: repoRoot,
      filePaths: [`packages/clis/repo/src/main.ts`],
    },
    {
      runCommand: async (props: RunCommandProps) => {
        commands.push(props);
        return { exitCode: 0 };
      },
    },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([]);
});
