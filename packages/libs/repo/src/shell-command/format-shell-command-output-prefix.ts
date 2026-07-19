import { formatTerminalCommandPrefix } from '@jearle/util-terminal';

import { type ExecuteShellCommandProps } from './execute-shell-command';
import { formatShellCommand } from './format-shell-command';

export const formatShellCommandOutputPrefix = (
  props: ExecuteShellCommandProps,
  shouldUseColor: boolean,
) => {
  const { args, label } = props;
  const command = formatShellCommand(args);
  const result = formatTerminalCommandPrefix({
    command,
    label,
    shouldPrintCommand: props.printCommand,
    shouldUseColor,
  });

  return result;
};
