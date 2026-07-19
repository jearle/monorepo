import { type ZodObject, type ZodRawShape } from 'zod';

import { validateEnv } from './validate-env';

export type ParseEnvProps<T extends ZodRawShape> = {
  readonly EnvSchema: ZodObject<T>;
};

export const parseEnv = <T extends ZodRawShape>(props: ParseEnvProps<T>) => {
  const { EnvSchema } = props;
  const validationResult = validateEnv({
    EnvSchema,
    env: process.env,
  });

  if (validationResult.success === false) {
    console.error(`Invalid environment variables:\n`, validationResult.error);
    process.exit(1);
  }

  const { env } = validationResult;

  const result = { env };

  return result;
};
