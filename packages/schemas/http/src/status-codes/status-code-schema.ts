import { z } from 'zod';

import { STATUS_CODE_MAP } from './constants';

const STATUS_CODES = Object.values(STATUS_CODE_MAP);
const STATUS_CODE_LITERALS = STATUS_CODES.map((statusCode) => {
  return z.literal(statusCode);
});
export const StatusCodeSchema = z.union(STATUS_CODE_LITERALS);
