import { type Job, runJobs } from '@jearle/util-jobs';

import {
  type ExecuteBufferedShellCommand,
  type ExecuteStreamingShellCommand,
} from '../shell-command';
import { DEFAULT_REPO_JOB_CONCURRENCY } from './constants';

type FullVerifyCommand = {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly label: string;
  readonly outputMode: `buffered` | `streaming`;
};

export type FullVerifyRunners = {
  readonly runBufferedCommand: ExecuteBufferedShellCommand;
  readonly runStreamingCommand: ExecuteStreamingShellCommand;
};

const printFullVerifyCheckStart = (label: string) => {
  console.log(`\nverify check started: ${label}`);
};

const printFullVerifyCheckFinish = (label: string, exitCode: number) => {
  const status = exitCode === 0 ? `passed` : `failed`;
  console.log(`\nverify check ${status}: ${label}`);
};

const createFullVerifyCommands = (repoRoot: string) => {
  const result: readonly FullVerifyCommand[] = [
    {
      args: [`bun`, `run`, `compile`],
      cwd: repoRoot,
      label: `compile`,
      outputMode: `buffered`,
    },
    {
      args: [`bun`, `run`, `lint`],
      cwd: repoRoot,
      label: `lint`,
      outputMode: `buffered`,
    },
    {
      args: [`bun`, `run`, `verify:deps`],
      cwd: repoRoot,
      label: `verify:deps`,
      outputMode: `buffered`,
    },
    {
      args: [`bun`, `run`, `verify:package-exports`],
      cwd: repoRoot,
      label: `verify:package-exports`,
      outputMode: `streaming`,
    },
    {
      args: [`bun`, `run`, `verify:package-scripts`],
      cwd: repoRoot,
      label: `verify:package-scripts`,
      outputMode: `buffered`,
    },
    {
      args: [`bunx`, `turbo`, `run`, `lint:style`],
      cwd: repoRoot,
      label: `lint:style`,
      outputMode: `buffered`,
    },
  ];

  return result;
};

const createFullVerifyJob = (
  command: FullVerifyCommand,
  runners: FullVerifyRunners,
) => {
  const result: Job = {
    label: command.label,
    run: async () => {
      const { runBufferedCommand, runStreamingCommand } = runners;
      const runCommand =
        command.outputMode === `streaming`
          ? runStreamingCommand
          : runBufferedCommand;

      printFullVerifyCheckStart(command.label);

      const commandProps = {
        args: command.args,
        cwd: command.cwd,
        label: command.label,
      };
      const commandResult = await runCommand(commandProps);
      const { exitCode } = commandResult;

      printFullVerifyCheckFinish(command.label, exitCode);

      return exitCode;
    },
  };

  return result;
};
export type RunFullVerifyProps = {
  readonly repoRoot: string;
  readonly runners: FullVerifyRunners;
};

export const runFullVerify = async (props: RunFullVerifyProps) => {
  const { repoRoot, runners } = props;
  const commands = createFullVerifyCommands(repoRoot);
  const jobs = commands.map((command) => createFullVerifyJob(command, runners));
  const jobsResult = await runJobs({
    concurrency: DEFAULT_REPO_JOB_CONCURRENCY,
    jobs,
  });
  const { exitCode } = jobsResult;

  return exitCode;
};
