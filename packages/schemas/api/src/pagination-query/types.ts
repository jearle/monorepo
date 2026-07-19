import { type z } from 'zod';

import { type PaginationQuerySchema } from './pagination-query-schema';

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
