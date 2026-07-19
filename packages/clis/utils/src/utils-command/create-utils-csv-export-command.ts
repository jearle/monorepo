import { type HandlerArgs, defineCommand, option } from '@bunli/core';
import {
  failCLICommand,
  readCLIJSONInput,
  writeCLIStdout,
} from '@jearle/util-cli';
import { checkIsCSVExportInput, toCSV } from '@jearle/util-csv';
import { z } from 'zod';

import {
  COMMAND_UTILS_CSV_EXPORT,
  COMMAND_UTILS_CSV_EXPORT_DESCRIPTION,
} from './constants';
import { getUtilsCommandErrorMessage } from './errors';
import { type UtilsCommandContext } from './types';
type HandlerPropsHandlerArgs = {
  readonly file: string | undefined;
  readonly header: boolean;
};

type HandlerProps = HandlerArgs<HandlerPropsHandlerArgs>;

export const createUtilsCSVExportCommand = (ctx: UtilsCommandContext) => {
  const utilsCSVExportCommand = defineCommand({
    name: COMMAND_UTILS_CSV_EXPORT,
    description: COMMAND_UTILS_CSV_EXPORT_DESCRIPTION,
    options: {
      file: option(z.string().min(1).optional(), {
        description: `JSON input file path. Reads stdin when omitted`,
      }),
      header: option(z.coerce.boolean().default(true), {
        argumentKind: `flag`,
        description: `Write header row`,
      }),
    },
    handler: async (props: HandlerProps) => {
      const { cwd, flags } = props;
      const jsonResult = await readCLIJSONInput(ctx, {
        cwd,
        filePath: flags.file,
      });

      if (jsonResult.success === false) {
        return;
      }

      const isCSVExportInput = checkIsCSVExportInput(jsonResult.data);

      if (isCSVExportInput === false) {
        failCLICommand(ctx, {
          message: `CSV export input must be an array of rows or an object with fields and data`,
        });
        return;
      }

      try {
        const { csv } = toCSV({
          json: jsonResult.data,
          config: {
            header: flags.header,
          },
        });

        writeCLIStdout(ctx, { data: csv });
      } catch (error) {
        const message = getUtilsCommandErrorMessage(error);

        failCLICommand(ctx, { message });
      }
    },
  });
  const result = { utilsCSVExportCommand };

  return result;
};
