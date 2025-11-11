import { z } from 'zod';

import { BaseErrorSchema } from '../base-error';

import { CLIENT_ERROR_TYPE } from './constants';

export const ClientErrorSchema = BaseErrorSchema.extend({
  type: z.literal(CLIENT_ERROR_TYPE),
});
