import { z } from 'zod';

import { BaseErrorSchema } from '../base-error';

import { SYSTEM_ERROR_TYPE } from './constants';

export const SystemErrorSchema = BaseErrorSchema.extend({
  type: z.literal(SYSTEM_ERROR_TYPE),
  stack: z.string().nullable(),
});
