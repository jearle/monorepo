import { defineGroup } from '@bunli/core';

import { COMMAND_UTILS_ENV, COMMAND_UTILS_ENV_DESCRIPTION } from './constants';
import { createUtilsEnvValidateCommand } from './create-utils-env-validate-command';
import { type UtilsCommandContext } from './types';

export const createUtilsEnvCommand = (ctx: UtilsCommandContext) => {
  const { utilsEnvValidateCommand } = createUtilsEnvValidateCommand(ctx);
  const utilsEnvCommand = defineGroup({
    name: COMMAND_UTILS_ENV,
    description: COMMAND_UTILS_ENV_DESCRIPTION,
    commands: [utilsEnvValidateCommand],
  });
  const result = { utilsEnvCommand };

  return result;
};
