import { z } from 'zod';

import { ERROR_KINDS } from './constants';

export const ErrorKindSchema = z.literal(ERROR_KINDS);

export const ErrorSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
});

export const ErrorResultSchema = z.object({
  success: z.literal(false),
  kind: ErrorKindSchema,
  code: z.string(),
  error: ErrorSchema,
});
