import { UNITS } from '../units';

const unitGroup = UNITS.join(`|`);
export const DURATION_STRING_REGEXP = new RegExp(`^(\\d+)(${unitGroup})$`);
