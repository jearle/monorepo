import { z } from 'zod';

import type { BaseErrorSchema } from './base-error-schema';

export type BaseError = Readonly<z.infer<typeof BaseErrorSchema>>;
