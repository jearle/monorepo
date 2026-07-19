import { type ZodObject, type ZodRawShape, type z } from 'zod';

export type EnvValidationSuccess<T extends ZodRawShape> = {
  readonly env: z.infer<ZodObject<T>>;
  readonly success: true;
};

export type EnvValidationFailure = {
  readonly error: ReturnType<typeof z.treeifyError>;
  readonly success: false;
};

export type EnvValidationResult<T extends ZodRawShape> =
  | EnvValidationFailure
  | EnvValidationSuccess<T>;
