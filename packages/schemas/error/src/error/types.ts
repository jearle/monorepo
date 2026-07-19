import { type z } from 'zod';

import {
  type ErrorKindSchema,
  type ErrorResultSchema,
  type ErrorSchema,
} from './schema';

export type Error = z.infer<typeof ErrorSchema>;
export type ErrorKind = z.infer<typeof ErrorKindSchema>;
export type ErrorResult = z.infer<typeof ErrorResultSchema>;
