import { type HandlerArgs, defineCommand, option } from '@bunli/core';
import {
  createCLIJSONSpace,
  failCLICommand,
  readCLITextInput,
  writeCLIJSONOutput,
} from '@jearle/util-cli';
import { safeParse } from '@jearle/util-json';
import { z } from 'zod';

import {
  COMMAND_UTILS_JSON_PARSE,
  COMMAND_UTILS_JSON_PARSE_DESCRIPTION,
} from './constants';
import { type UtilsCommandContext } from './types';
type HandlerPropsHandlerArgs = {
  readonly file: string | undefined;
  readonly space: number;
};

type HandlerProps = HandlerArgs<HandlerPropsHandlerArgs>;

export const createUtilsJSONParseCommand = (ctx: UtilsCommandContext) => {
  const utilsJSONParseCommand = defineCommand({
    name: COMMAND_UTILS_JSON_PARSE,
    description: COMMAND_UTILS_JSON_PARSE_DESCRIPTION,
    options: {
      file: option(z.string().min(1).optional(), {
        description: `JSON input file path. Reads stdin when omitted`,
      }),
      space: option(z.coerce.number().int().min(0).max(10).default(2), {
        description: `Output indentation spaces`,
      }),
    },
    handler: async (props: HandlerProps) => {
      const { cwd, flags } = props;
      const inputResult = await readCLITextInput(ctx, {
        cwd,
        filePath: flags.file,
      });

      if (inputResult.success === false) {
        return;
      }

      const parseResult = safeParse(inputResult.data);

      if (parseResult.success === false) {
        failCLICommand(ctx, { message: parseResult.error.message });
        return;
      }

      const space = createCLIJSONSpace({ spaceSize: flags.space });

      writeCLIJSONOutput(ctx, {
        data: parseResult.data,
        space,
      });
    },
  });
  const result = { utilsJSONParseCommand };

  return result;
};
