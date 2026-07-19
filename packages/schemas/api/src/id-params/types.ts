import { type z } from 'zod';

import { type IdParamsSchema } from './id-params-schema';

export type IdParams = z.infer<typeof IdParamsSchema>;
