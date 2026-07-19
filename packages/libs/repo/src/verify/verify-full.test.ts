import { expect, test } from 'bun:test';

import { verify } from '.';
import { resolveTestRepoRoot } from './resolve-test-repo-root';
import { type CapturedCommand } from './verify-test-helper-types';

type RunBufferedCommandProps = CapturedCommand;

type RunStreamingCommandProps = CapturedCommand;

const expectedBufferedCommands = (repoRoot: string) => [
  {
    args: [`bun`, `run`, `compile`],
    cwd: repoRoot,
    label: `compile`,
  },
  {
    args: [`bun`, `run`, `lint`],
    cwd: repoRoot,
    label: `lint`,
  },
  {
    args: [`bun`, `run`, `verify:deps`],
    cwd: repoRoot,
    label: `verify:deps`,
  },
  {
    args: [`bun`, `run`, `verify:package-scripts`],
    cwd: repoRoot,
    label: `verify:package-scripts`,
  },
  {
    args: [`bunx`, `turbo`, `run`, `lint:style`],
    cwd: repoRoot,
    label: `lint:style`,
  },
];

const expectedStreamingCommands = (repoRoot: string) => [
  {
    args: [`bun`, `run`, `verify:package-exports`],
    cwd: repoRoot,
    label: `verify:package-exports`,
  },
];

test(`runs full verify through root script parity commands`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const bufferedCommands: CapturedCommand[] = [];
  const streamingCommands: CapturedCommand[] = [];

  const result = await verify(
    {
      cwd: repoRoot,
      filePaths: [],
    },
    {
      runBufferedCommand: async (props: RunBufferedCommandProps) => {
        bufferedCommands.push(props);
        return { exitCode: 0 };
      },
      runStreamingCommand: async (props: RunStreamingCommandProps) => {
        streamingCommands.push(props);
        return { exitCode: 0 };
      },
    },
  );

  expect(result.exitCode).toBe(0);
  expect(bufferedCommands).toEqual(expectedBufferedCommands(repoRoot));
  expect(streamingCommands).toEqual(expectedStreamingCommands(repoRoot));
});

test(`reports full verify failure after scheduling every root command`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const bufferedCommands: CapturedCommand[] = [];
  const streamingCommands: CapturedCommand[] = [];
  const result = await verify(
    {
      cwd: repoRoot,
      filePaths: [],
    },
    {
      runBufferedCommand: async (props: RunBufferedCommandProps) => {
        bufferedCommands.push(props);

        if (props.label === `lint`) {
          return { exitCode: 1 };
        }

        return { exitCode: 0 };
      },
      runStreamingCommand: async (props: RunStreamingCommandProps) => {
        streamingCommands.push(props);
        return { exitCode: 0 };
      },
    },
  );

  expect(result.exitCode).toBe(1);
  expect(bufferedCommands).toEqual(expectedBufferedCommands(repoRoot));
  expect(streamingCommands).toEqual(expectedStreamingCommands(repoRoot));
});
