import { type ZodObject, type ZodRawShape, z } from 'zod';

import {
  type EnvValidationFailure,
  type EnvValidationResult,
  type EnvValidationSuccess,
} from './types';

export type ValidateEnvProps<T extends ZodRawShape> = {
  readonly EnvSchema: ZodObject<T>;
  readonly env: Record<string, unknown>;
};

export const validateEnv = <T extends ZodRawShape>(
  props: ValidateEnvProps<T>,
): EnvValidationResult<T> => {
  const { EnvSchema, env: maybeEnv } = props;
  const parsedEnv = EnvSchema.safeParse(maybeEnv);

  if (parsedEnv.success === false) {
    const error = z.treeifyError(parsedEnv.error);
    const result: EnvValidationFailure = {
      error,
      success: false,
    };

    return result;
  }

  const { data: env } = parsedEnv;
  const result: EnvValidationSuccess<T> = {
    env,
    success: true,
  };

  return result;
};
