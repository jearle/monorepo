import { spawnSync } from 'node:child_process';

import { formatShellCommand } from './format-shell-command';

export type ExecuteShellCommandProps = {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly label?: string;
  readonly printCommand?: boolean;
  readonly printSuccessOutput?: boolean;
};

export const executeShellCommand = (props: ExecuteShellCommandProps) => {
  const { args, cwd, label } = props;
  const [commandName, ...commandArgs] = args;

  if (commandName === undefined) {
    return 1;
  }

  const hasLabel = label !== undefined;

  if (hasLabel) {
    const command = formatShellCommand(args);

    console.log(`\n${label}`);
    console.log(`$ ${command}`);
  }

  const result = spawnSync(commandName, commandArgs, {
    cwd,
    stdio: `inherit`,
  });
  const status = result.status ?? 1;

  return status;
};
