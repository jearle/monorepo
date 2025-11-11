import { z } from 'zod';

import { ClientErrorSchema } from './client-error-schema';

export type ClientError = Readonly<z.infer<typeof ClientErrorSchema>>;
