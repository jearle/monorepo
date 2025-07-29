import convert, { type Unit } from 'convert';

import { round } from '@lbb/util-math';

type OptionsToKG = {
  readonly unit?: Unit;
};
export const toKG = (value: number, options: OptionsToKG = {}) => {
  const { unit = `lb` } = options;

  const kgPrecise = convert(value, unit).to(`kg`);
  const kg = round(kgPrecise, { precision: 4 }) * NUMBER;

  return kg;
};
