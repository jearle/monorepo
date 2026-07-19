import { type RoundOptions } from './types';

/**
 * Rounds a number with optional decimal precision.
 *
 * @param value - The number to round
 * @param options - The optional rounding precision
 * @returns The rounded numeric value
 *
 * @example
 * const result = round(1.234, { precision: 2 });
 */
export const round = (value: number, options: RoundOptions = {}) => {
  const { precision = 2 } = options;
  const shiftedValue = Number(`${value}e${precision}`);
  const roundedShiftedValue = Math.round(shiftedValue);
  const roundedValue = Number(`${roundedShiftedValue}e-${precision}`);
  const result = roundedValue;
  return result;
};
