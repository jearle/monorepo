import { PATHS_RESULT_STATUS_ERROR, findRepoRoot } from '../paths';
import { test as runTest } from '.';
import { expect, test } from 'bun:test';

type CapturedCommand = {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly label?: string;
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

test(`runs scoped tests against affected workspace test script`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];

  const result = await runTest(
    {
      cwd: repoRoot,
      filePaths: [`packages/clis/repo/src/main.ts`],
    },
    {
      runCommand: (props: RunCommandProps) => {
        commands.push(props);
        return 0;
      },
    },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([
    {
      args: [`bunx`, `turbo`, `run`, `test`, `--filter=@jearle/cli-repo`],
      cwd: repoRoot,
      label: `test staged workspaces`,
    },
  ]);
});

test(`skips scoped tests for package manifest-only changes`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];
  const result = await runTest(
    {
      cwd: repoRoot,
      filePaths: [`packages/apis/prompt-defense/package.json`],
    },
    {
      runCommand: (props: RunCommandProps) => {
        commands.push(props);
        return 0;
      },
    },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([]);
});
