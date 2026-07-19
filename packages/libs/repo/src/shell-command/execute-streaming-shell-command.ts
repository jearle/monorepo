import { spawn } from 'node:child_process';

import { type ExecuteShellCommandProps } from './execute-shell-command';
import { type ShellCommandResult } from './types';
import { checkShouldUseShellCommandColor } from './check-should-use-shell-command-color';
import { createShellCommandEnvironment } from './create-shell-command-environment';
import { createShellCommandProcessEnvironment } from './create-shell-command-process-environment';
import { formatShellCommandOutputPrefix } from './format-shell-command-output-prefix';

const writeCommandPrefix = (
  props: ExecuteShellCommandProps,
  shouldUseColor: boolean,
) => {
  const outputPrefix = formatShellCommandOutputPrefix(props, shouldUseColor);

  if (outputPrefix.length > 0) {
    process.stdout.write(outputPrefix);
  }
};

export const executeStreamingShellCommand = (
  props: ExecuteShellCommandProps,
) => {
  const { args, cwd } = props;
  const [commandName, ...commandArgs] = args;

  if (commandName === undefined) {
    const result: Promise<ShellCommandResult> = Promise.resolve({
      exitCode: 1,
    });

    return result;
  }

  const result = new Promise<ShellCommandResult>((resolve) => {
    const environment = createShellCommandEnvironment();
    const shouldUseColor = checkShouldUseShellCommandColor(environment);
    const childProcess = spawn(commandName, commandArgs, {
      cwd,
      env: createShellCommandProcessEnvironment(environment, shouldUseColor),
      stdio: [`ignore`, `inherit`, `inherit`],
    });
    let hasResolved = false;

    writeCommandPrefix(props, shouldUseColor);

    const finalize = (exitCode: number | null) => {
      if (hasResolved) {
        return;
      }

      hasResolved = true;
      const commandExitCode = exitCode ?? 1;
      const result: ShellCommandResult = {
        exitCode: commandExitCode,
      };

      resolve(result);
    };

    childProcess.on(`error`, (error) => {
      console.error(error.message);
      finalize(1);
    });

    childProcess.on(`close`, (exitCode) => {
      finalize(exitCode);
    });
  });

  return result;
};
