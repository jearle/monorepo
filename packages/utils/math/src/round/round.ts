import lodashRound from 'lodash.round';

type OptionsRound = {
  readonly precision?: number;
};
export const round = (value: number, options: OptionsRound = {}) => {
  const { precision = 2 } = options;

  const valueRound = lodashRound(value, precision);

  return valueRound;
};
