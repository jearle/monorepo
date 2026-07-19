import { pathToFileURL } from 'node:url';

import {
  type CLICommandResult,
  failCLICommand,
  resolveCLIInputPath,
} from '@jearle/util-cli';
import { NodeEnvSchema } from '@jearle/util-env';
import { type ZodObject, type ZodRawShape, z } from 'zod';

import { UTILS_ENV_SCHEMA_NODE_ENV } from './constants';
import { getUtilsCommandErrorMessage } from './errors';
import { type UtilsCommandContext } from './types';

const checkIsRecord = (value: unknown): value is Record<string, unknown> => {
  const result =
    value !== null &&
    typeof value === `object` &&
    Array.isArray(value) === false;

  return result;
};

const checkIsZodObject = (value: unknown): value is ZodObject<ZodRawShape> => {
  const result = value instanceof z.ZodObject;

  return result;
};

type LoadSchemaFromFileProps = {
  readonly cwd: string;
  readonly schemaExport: string;
  readonly schemaFile: string;
};

const loadSchemaFromFile = async (
  ctx: UtilsCommandContext,
  props: LoadSchemaFromFileProps,
): Promise<CLICommandResult<ZodObject<ZodRawShape>>> => {
  const { cwd, schemaExport, schemaFile } = props;
  const schemaPath = resolveCLIInputPath({
    cwd,
    filePath: schemaFile,
  });
  const schemaUrl = pathToFileURL(schemaPath).href;
  let schemaModuleUnknown: unknown;

  try {
    schemaModuleUnknown = await import(schemaUrl);
  } catch (error) {
    const message = getUtilsCommandErrorMessage(error);
    const result = failCLICommand(ctx, {
      message: `Failed to load schema file: ${message}`,
    });

    return result;
  }

  if (checkIsRecord(schemaModuleUnknown) === false) {
    const result = failCLICommand(ctx, {
      message: `Schema file did not export ${schemaExport}`,
    });

    return result;
  }

  const maybeSchema = schemaModuleUnknown[schemaExport];

  if (checkIsZodObject(maybeSchema) === false) {
    const result = failCLICommand(ctx, {
      message: `Schema export ${schemaExport} must be a Zod object`,
    });

    return result;
  }

  const result: CLICommandResult<ZodObject<ZodRawShape>> = {
    data: maybeSchema,
    success: true,
  };

  return result;
};

export type LoadUtilsEnvSchemaProps = {
  readonly cwd: string;
  readonly schema?: typeof UTILS_ENV_SCHEMA_NODE_ENV;
  readonly schemaExport: string;
  readonly schemaFile?: string;
};

export const loadUtilsEnvSchema = async (
  ctx: UtilsCommandContext,
  props: LoadUtilsEnvSchemaProps,
): Promise<CLICommandResult<ZodObject<ZodRawShape>>> => {
  const { cwd, schema, schemaExport, schemaFile } = props;

  if (schema === UTILS_ENV_SCHEMA_NODE_ENV) {
    const envSchema = z.object({
      NODE_ENV: NodeEnvSchema,
    });
    const result: CLICommandResult<ZodObject<ZodRawShape>> = {
      data: envSchema,
      success: true,
    };

    return result;
  }

  if (schemaFile === undefined) {
    const result = failCLICommand(ctx, {
      message: `Provide --schema node-env or --schema-file <path>`,
    });

    return result;
  }

  const result = await loadSchemaFromFile(ctx, {
    cwd,
    schemaExport,
    schemaFile,
  });

  return result;
};
