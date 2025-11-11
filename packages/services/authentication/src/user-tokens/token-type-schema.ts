import { z } from 'zod';

import { TOKEN_TYPES } from './constants';

export const TokenTypeSchema = z.enum(TOKEN_TYPES);
