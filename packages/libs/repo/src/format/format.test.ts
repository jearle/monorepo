import { PATHS_RESULT_STATUS_ERROR, findRepoRoot } from '../paths';
import { format } from '.';
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

test(`runs full format through Prettier CLI parity command`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];

  const result = await format(
    {
      cwd: repoRoot,
      filePaths: [],
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
      args: [`prettier`, `--write`, `--ignore-unknown`, `.`],
      cwd: repoRoot,
    },
  ]);
});

test(`does not treat outside-repo paths as full format requests`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];
  const result = await format(
    {
      cwd: repoRoot,
      filePaths: [`../outside.ts`],
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
