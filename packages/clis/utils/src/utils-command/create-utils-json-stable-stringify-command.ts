import { type HandlerArgs, defineCommand, option } from '@bunli/core';
import {
  createCLIJSONSpace,
  failCLICommand,
  readCLIJSONInput,
  writeCLIStdoutLine,
} from '@jearle/util-cli';
import { stableStringify } from '@jearle/util-json';
import { z } from 'zod';

import {
  COMMAND_UTILS_JSON_STABLE_STRINGIFY,
  COMMAND_UTILS_JSON_STABLE_STRINGIFY_DESCRIPTION,
} from './constants';
import { type UtilsCommandContext } from './types';
type HandlerPropsHandlerArgs = {
  readonly file: string | undefined;
  readonly space: number;
};

type HandlerProps = HandlerArgs<HandlerPropsHandlerArgs>;

export const createUtilsJSONStableStringifyCommand = (
  ctx: UtilsCommandContext,
) => {
  const utilsJSONStableStringifyCommand = defineCommand({
    name: COMMAND_UTILS_JSON_STABLE_STRINGIFY,
    description: COMMAND_UTILS_JSON_STABLE_STRINGIFY_DESCRIPTION,
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
      const jsonResult = await readCLIJSONInput(ctx, {
        cwd,
        filePath: flags.file,
      });

      if (jsonResult.success === false) {
        return;
      }

      const space = createCLIJSONSpace({ spaceSize: flags.space });
      const stringifyResult = stableStringify(jsonResult.data, space);

      if (stringifyResult.success === false) {
        failCLICommand(ctx, { message: stringifyResult.error.message });
        return;
      }

      writeCLIStdoutLine(ctx, { data: stringifyResult.data });
    },
  });
  const result = { utilsJSONStableStringifyCommand };

  return result;
};
