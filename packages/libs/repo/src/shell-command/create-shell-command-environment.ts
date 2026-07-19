import { parseEnv } from '@jearle/util-env';

import { ShellCommandEnvironmentSchema } from './shell-command-environment-schema';

export const createShellCommandEnvironment = () => {
  const { env } = parseEnv({
    EnvSchema: ShellCommandEnvironmentSchema,
  });

  return env;
};
