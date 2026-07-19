import { type z } from 'zod';

import { type ResultErrorSchema } from './schemas';

export type ResultError = z.infer<typeof ResultErrorSchema>;
