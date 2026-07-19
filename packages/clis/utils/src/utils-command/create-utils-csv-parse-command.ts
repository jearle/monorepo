import { type HandlerArgs, defineCommand, option } from '@bunli/core';
import {
  failCLICommand,
  readCLITextInput,
  writeCLIJSONOutput,
} from '@jearle/util-cli';
import { createCSVShape, toJSON } from '@jearle/util-csv';
import { z } from 'zod';

import {
  COMMAND_UTILS_CSV_PARSE,
  COMMAND_UTILS_CSV_PARSE_DESCRIPTION,
} from './constants';
import { type UtilsCommandContext } from './types';
type HandlerPropsHandlerArgs = {
  readonly file: string;
  readonly header: boolean;
};

type HandlerProps = HandlerArgs<HandlerPropsHandlerArgs>;

export const createUtilsCSVParseCommand = (ctx: UtilsCommandContext) => {
  const utilsCSVParseCommand = defineCommand({
    name: COMMAND_UTILS_CSV_PARSE,
    description: COMMAND_UTILS_CSV_PARSE_DESCRIPTION,
    options: {
      file: option(z.string().min(1), {
        description: `CSV input file path`,
      }),
      header: option(z.coerce.boolean().default(false), {
        argumentKind: `flag`,
        description: `Treat the first row as headers`,
      }),
    },
    handler: async (props: HandlerProps) => {
      const { cwd, flags } = props;
      const csvResult = await readCLITextInput(ctx, {
        cwd,
        filePath: flags.file,
      });

      if (csvResult.success === false) {
        return;
      }

      const parseResult = toJSON(csvResult.data, {
        header: flags.header,
        skipEmptyLines: `greedy`,
      });

      if (parseResult.errors.length > 0) {
        const [firstError] = parseResult.errors;
        const message = firstError?.message ?? `CSV parse failed`;

        failCLICommand(ctx, { message });
        return;
      }

      const rows = Array.isArray(parseResult.json) ? parseResult.json : [];
      const columns =
        flags.header === true ? (parseResult.meta.fields ?? []) : undefined;
      const shape = createCSVShape({ columns, rows });

      writeCLIJSONOutput(ctx, {
        data: {
          ...shape,
          rows,
        },
      });
    },
  });
  const result = { utilsCSVParseCommand };

  return result;
};
