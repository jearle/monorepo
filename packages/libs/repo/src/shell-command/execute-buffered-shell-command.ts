import { spawn } from 'node:child_process';

import { type ExecuteShellCommandProps } from './execute-shell-command';
import { type BufferedShellCommandResult } from './types';
import { checkShouldUseShellCommandColor } from './check-should-use-shell-command-color';
import { createShellCommandEnvironment } from './create-shell-command-environment';
import { createShellCommandProcessEnvironment } from './create-shell-command-process-environment';
import { formatShellCommandOutputPrefix } from './format-shell-command-output-prefix';

const writeCommandOutput = (
  props: ExecuteShellCommandProps,
  output: string,
  shouldUseColor: boolean,
  exitCode: number,
) => {
  if (exitCode === 0 && props.printSuccessOutput === false) {
    return;
  }

  const outputPrefix = formatShellCommandOutputPrefix(props, shouldUseColor);
  const hasOutput = output.length > 0;
  const text = hasOutput ? `${outputPrefix}${output}` : outputPrefix;

  if (text.length > 0) {
    process.stdout.write(text);
  }
};

export const executeBufferedShellCommand = (
  props: ExecuteShellCommandProps,
) => {
  const { args, cwd } = props;
  const [commandName, ...commandArgs] = args;

  if (commandName === undefined) {
    const result: Promise<BufferedShellCommandResult> = Promise.resolve({
      exitCode: 1,
    });

    return result;
  }

  const result = new Promise<BufferedShellCommandResult>((resolve) => {
    const environment = createShellCommandEnvironment();
    const shouldUseColor = checkShouldUseShellCommandColor(environment);
    const childProcess = spawn(commandName, commandArgs, {
      cwd,
      env: createShellCommandProcessEnvironment(environment, shouldUseColor),
      stdio: [`ignore`, `pipe`, `pipe`],
    });
    let hasResolved = false;
    let output = ``;

    const finalize = (exitCode: number | null) => {
      if (hasResolved) {
        return;
      }

      hasResolved = true;
      const commandExitCode = exitCode ?? 1;
      writeCommandOutput(props, output, shouldUseColor, commandExitCode);

      const result: BufferedShellCommandResult = {
        exitCode: commandExitCode,
      };

      resolve(result);
    };

    childProcess.stdout.on(`data`, (data: Buffer | string) => {
      const text = data.toString();
      output = `${output}${text}`;
    });

    childProcess.stderr.on(`data`, (data: Buffer | string) => {
      const text = data.toString();
      output = `${output}${text}`;
    });

    childProcess.on(`error`, (error) => {
      output = `${output}${error.message}\n`;
      finalize(1);
    });

    childProcess.on(`close`, (exitCode) => {
      finalize(exitCode);
    });
  });

  return result;
};
