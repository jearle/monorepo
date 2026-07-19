import convert from 'convert';

import { round } from '@jearle/util-math';

import { type ToKGOptions } from './types';

/**
 * Converts a numeric value to kilograms.
 *
 * @param value - The numeric value to convert
 * @param options - The optional source unit
 * @returns The rounded kilogram value
 *
 * @example
 * const result = toKG(2.2, { unit: `lb` });
 */
export const toKG = (value: number, options: ToKGOptions = {}) => {
  const { unit = `lb` } = options;
  const preciseKilograms = convert(value, unit).to(`kg`);
  const kilograms = round(preciseKilograms);
  const result = kilograms;

  return result;
};
