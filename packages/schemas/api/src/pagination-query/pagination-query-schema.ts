import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  page: z.coerce.number().int().min(0).default(0),
});
