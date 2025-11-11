import { z } from 'zod';

import { BaseResponseSchema } from './base-response-schema';

export type BaseResponse = Readonly<z.infer<typeof BaseResponseSchema>>;
