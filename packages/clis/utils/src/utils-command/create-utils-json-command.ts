import { defineGroup } from '@bunli/core';

import {
  COMMAND_UTILS_JSON,
  COMMAND_UTILS_JSON_DESCRIPTION,
} from './constants';
import { createUtilsJSONParseCommand } from './create-utils-json-parse-command';
import { createUtilsJSONStableStringifyCommand } from './create-utils-json-stable-stringify-command';
import { createUtilsJSONStringifyCommand } from './create-utils-json-stringify-command';
import { type UtilsCommandContext } from './types';

export const createUtilsJSONCommand = (ctx: UtilsCommandContext) => {
  const { utilsJSONParseCommand } = createUtilsJSONParseCommand(ctx);
  const { utilsJSONStringifyCommand } = createUtilsJSONStringifyCommand(ctx);
  const { utilsJSONStableStringifyCommand } =
    createUtilsJSONStableStringifyCommand(ctx);
  const utilsJSONCommand = defineGroup({
    name: COMMAND_UTILS_JSON,
    description: COMMAND_UTILS_JSON_DESCRIPTION,
    commands: [
      utilsJSONParseCommand,
      utilsJSONStringifyCommand,
      utilsJSONStableStringifyCommand,
    ],
  });
  const result = { utilsJSONCommand };

  return result;
};
