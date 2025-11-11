import convert, { type Unit } from 'convert';

import { round } from '@jearle/util-math';

type OptionsToKG = {
  readonly unit?: Unit;
};
export const toKG = (value: number, options: OptionsToKG = {}) => {
  const { unit = `lb` } = options;

  const kgPrecise = convert(value, unit).to(`kg`);
  const kg = round(kgPrecise);

  return kg;
};
