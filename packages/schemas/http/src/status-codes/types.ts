import { z } from 'zod';

import { StatusCodeSchema } from './status-code-schema';

export type StatusCode = z.infer<typeof StatusCodeSchema>;
