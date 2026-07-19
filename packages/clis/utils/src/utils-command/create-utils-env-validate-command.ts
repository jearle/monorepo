import { type HandlerArgs, defineCommand, option } from '@bunli/core';
import {
  readCLITextInput,
  writeCLIJSONErrorOutput,
  writeCLIJSONOutput,
} from '@jearle/util-cli';
import { parseEnvText, validateEnv } from '@jearle/util-env';
import { z } from 'zod';

import {
  COMMAND_UTILS_ENV_VALIDATE,
  COMMAND_UTILS_ENV_VALIDATE_DESCRIPTION,
  UTILS_ENV_DEFAULT_SCHEMA_EXPORT,
  UTILS_ENV_SCHEMA_NODE_ENV,
} from './constants';
import { loadUtilsEnvSchema } from './load-utils-env-schema';
import { type UtilsCommandContext } from './types';

const envSchemaOption = z.enum([UTILS_ENV_SCHEMA_NODE_ENV]).optional();
type HandlerPropsHandlerArgs = {
  readonly 'file': string | undefined;
  readonly 'schema': typeof UTILS_ENV_SCHEMA_NODE_ENV | undefined;
  readonly 'schema-export': string;
  readonly 'schema-file': string | undefined;
};

type HandlerProps = HandlerArgs<HandlerPropsHandlerArgs>;

export const createUtilsEnvValidateCommand = (ctx: UtilsCommandContext) => {
  const utilsEnvValidateCommand = defineCommand({
    name: COMMAND_UTILS_ENV_VALIDATE,
    description: COMMAND_UTILS_ENV_VALIDATE_DESCRIPTION,
    options: {
      [`schema`]: option(envSchemaOption, {
        description: `Built-in schema name`,
      }),
      [`schema-file`]: option(z.string().min(1).optional(), {
        description: `Module file exporting a Zod env schema`,
      }),
      [`schema-export`]: option(
        z.string().min(1).default(UTILS_ENV_DEFAULT_SCHEMA_EXPORT),
        {
          description: `Named schema export from --schema-file`,
        },
      ),
      [`file`]: option(z.string().min(1).optional(), {
        description: `Env file path. Uses current process.env when omitted`,
      }),
    },
    handler: async (props: HandlerProps) => {
      const { cwd, flags } = props;
      const schemaProps = {
        cwd,
        schemaExport: flags[`schema-export`],
        ...(flags.schema === undefined ? {} : { schema: flags.schema }),
        ...(flags[`schema-file`] === undefined
          ? {}
          : { schemaFile: flags[`schema-file`] }),
      };
      const schemaResult = await loadUtilsEnvSchema(ctx, schemaProps);

      if (schemaResult.success === false) {
        return;
      }

      if (flags.file === undefined) {
        const validationResult = validateEnv({
          EnvSchema: schemaResult.data,
          env: { ...process.env },
        });

        if (validationResult.success === false) {
          writeCLIJSONErrorOutput(ctx, { data: validationResult.error });
          return;
        }

        writeCLIJSONOutput(ctx, { data: { env: validationResult.env } });
        return;
      }

      const envFileResult = await readCLITextInput(ctx, {
        cwd,
        filePath: flags.file,
      });

      if (envFileResult.success === false) {
        return;
      }

      const parsedEnv = parseEnvText({ text: envFileResult.data });
      const validationResult = validateEnv({
        EnvSchema: schemaResult.data,
        env: parsedEnv,
      });

      if (validationResult.success === false) {
        writeCLIJSONErrorOutput(ctx, { data: validationResult.error });
        return;
      }

      writeCLIJSONOutput(ctx, { data: { env: validationResult.env } });
    },
  });
  const result = { utilsEnvValidateCommand };

  return result;
};
