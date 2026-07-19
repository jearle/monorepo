import { checkShouldUseColor } from '@jearle/util-terminal';

import { type ShellCommandEnvironment } from './shell-command-environment-schema';

export const checkShouldUseShellCommandColor = (
  environment: ShellCommandEnvironment,
) => {
  const isTTY = process.stdout.isTTY === true || process.stderr.isTTY === true;
  const result = checkShouldUseColor({ env: environment, isTTY });

  return result;
};
