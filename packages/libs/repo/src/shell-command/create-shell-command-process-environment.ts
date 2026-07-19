import { type ShellCommandEnvironment } from './shell-command-environment-schema';

export const createShellCommandProcessEnvironment = (
  environment: ShellCommandEnvironment,
  shouldUseColor: boolean,
) => {
  if (shouldUseColor === false) {
    return environment;
  }

  const result = {
    ...environment,
    CLICOLOR_FORCE: environment.CLICOLOR_FORCE ?? `1`,
    FORCE_COLOR: environment.FORCE_COLOR ?? `1`,
  };

  return result;
};
