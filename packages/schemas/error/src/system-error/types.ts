import { z } from 'zod';

import { SystemErrorSchema } from './system-error-schema';

export type SystemError = Readonly<z.infer<typeof SystemErrorSchema>>;
