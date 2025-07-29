import { z } from 'zod';

import { STATUSES } from './constants';

export const StatusSchema = z.enum(STATUSES);
