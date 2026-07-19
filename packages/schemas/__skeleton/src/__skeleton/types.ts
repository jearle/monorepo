import { type z } from 'zod';

import { type __SkeletonSchema } from './schemas';

export type __Skeleton = z.infer<typeof __SkeletonSchema>;
