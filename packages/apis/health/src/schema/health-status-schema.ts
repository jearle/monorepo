import { z } from 'zod';

import { HEALTH_STATUSES } from './constants';

export const HealthStatusSchema = z.enum(HEALTH_STATUSES);
