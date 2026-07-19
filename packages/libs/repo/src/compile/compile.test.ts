import { PATHS_RESULT_STATUS_ERROR, findRepoRoot } from '../paths';
import { compile } from '.';
import { expect, test } from 'bun:test';

type CapturedCommand = {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly label?: string;
};

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

test(`runs full compile through Turbo CLI parity command`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];
  type RunCommandProps = CapturedCommand;

  const result = await compile(
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
      args: [`turbo`, `run`, `compile`],
      cwd: repoRoot,
    },
  ]);
});
