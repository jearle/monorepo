import { createCLI } from '@bunli/core';
import { type Logger } from '@jearle/util-logger';

import { CLI_DESCRIPTION, CLI_NAME, CLI_VERSION } from '../constants';
import { type Env } from '../env';
import { type Services } from '../services';
import { createUtilsCommand } from '../utils-command';

export type CreateAppProps = {
  readonly env: Env;
  readonly logger: Logger;
  readonly services: Services;
};

export const createApp = async (props: CreateAppProps) => {
  const app = await createCLI({
    name: CLI_NAME,
    version: CLI_VERSION,
    description: CLI_DESCRIPTION,
  });
  const { utilsCommand } = createUtilsCommand(props);

  for (const command of utilsCommand.commands) {
    app.command(command);
  }

  const result = { app };
  return result;
};
