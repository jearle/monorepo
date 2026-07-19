import { expect, test } from 'bun:test';

import { PATHS_RESULT_STATUS_ERROR, findRepoRoot } from '../paths';
import { lint } from '.';

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

test(`runs full lint through Oxlint CLI parity command`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];

  const result = await lint(
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
      args: [
        `oxlint`,
        `.`,
        `--config`,
        `packages/configs/oxlint/.oxlintrc.json`,
        `--no-error-on-unmatched-pattern`,
      ],
      cwd: repoRoot,
    },
  ]);
});

test(`runs scoped lint against matching JS and TS files`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const commands: CapturedCommand[] = [];
  const result = await lint(
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
  ]);
});
