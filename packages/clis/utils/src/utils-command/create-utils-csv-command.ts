import { defineGroup } from '@bunli/core';

import { COMMAND_UTILS_CSV, COMMAND_UTILS_CSV_DESCRIPTION } from './constants';
import { createUtilsCSVExportCommand } from './create-utils-csv-export-command';
import { createUtilsCSVParseCommand } from './create-utils-csv-parse-command';
import { type UtilsCommandContext } from './types';

export const createUtilsCSVCommand = (ctx: UtilsCommandContext) => {
  const { utilsCSVParseCommand } = createUtilsCSVParseCommand(ctx);
  const { utilsCSVExportCommand } = createUtilsCSVExportCommand(ctx);
  const utilsCSVCommand = defineGroup({
    name: COMMAND_UTILS_CSV,
    description: COMMAND_UTILS_CSV_DESCRIPTION,
    commands: [utilsCSVParseCommand, utilsCSVExportCommand],
  });
  const result = { utilsCSVCommand };

  return result;
};
