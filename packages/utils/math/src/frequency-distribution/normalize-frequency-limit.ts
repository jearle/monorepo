export type NormalizeFrequencyLimitProps = {
  readonly limit: number;
};

export const normalizeFrequencyLimit = (
  props: NormalizeFrequencyLimitProps,
) => {
  const { limit } = props;
  const isFiniteLimit = Number.isFinite(limit);

  if (isFiniteLimit === false) {
    return 0;
  }

  const integerLimit = Math.trunc(limit);
  const nonNegativeLimit = Math.max(0, integerLimit);
  const result = nonNegativeLimit;

  return result;
};
