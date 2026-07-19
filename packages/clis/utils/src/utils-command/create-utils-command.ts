import { defineGroup } from '@bunli/core';

import { COMMAND_UTILS, COMMAND_UTILS_DESCRIPTION } from './constants';
import { createUtilsCSVCommand } from './create-utils-csv-command';
import { createUtilsEnvCommand } from './create-utils-env-command';
import { createUtilsJSONCommand } from './create-utils-json-command';
import { createUtilsTemplateCommand } from './create-utils-template-command';
import { type UtilsCommandContext } from './types';
import { createUtilsHTTPCommand } from '../utils-http-command';

export const createUtilsCommand = (ctx: UtilsCommandContext) => {
  const { utilsTemplateCommand } = createUtilsTemplateCommand(ctx);
  const { utilsJSONCommand } = createUtilsJSONCommand(ctx);
  const { utilsCSVCommand } = createUtilsCSVCommand(ctx);
  const { utilsEnvCommand } = createUtilsEnvCommand(ctx);
  const { utilsHTTPCommand } = createUtilsHTTPCommand(ctx);
  const utilsCommand = defineGroup({
    name: COMMAND_UTILS,
    description: COMMAND_UTILS_DESCRIPTION,
    commands: [
      utilsTemplateCommand,
      utilsJSONCommand,
      utilsCSVCommand,
      utilsEnvCommand,
      utilsHTTPCommand,
    ],
  });

  const result = { utilsCommand };

  return result;
};
