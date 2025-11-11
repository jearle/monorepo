import { z } from 'zod';

import { NODE_ENVS } from './constants';

export const NodeEnvSchema = z.literal(NODE_ENVS);
