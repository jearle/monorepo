export type NormalizeBalancedSubsetCountProps = {
  readonly count: number;
};

export const normalizeBalancedSubsetCount = (
  props: NormalizeBalancedSubsetCountProps,
) => {
  const { count } = props;
  const isFiniteCount = Number.isFinite(count);

  if (isFiniteCount === false) {
    return 0;
  }

  const integerCount = Math.trunc(count);
  const result = Math.max(0, integerCount);

  return result;
};
