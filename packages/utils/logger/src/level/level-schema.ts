import { z } from 'zod';

import { LEVELS } from './constants';

export const LevelSchema = z.literal(LEVELS);
