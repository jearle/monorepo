import { z } from 'zod';

import {
  SuccessResponseSchema,
  SuccessResponseDataSchema,
} from '@jearle/schema-api';

export const LoginSuccessResponseSchema = SuccessResponseSchema.extend({
  data: SuccessResponseDataSchema.extend({
    accessToken: z.string(),
  }),
});
