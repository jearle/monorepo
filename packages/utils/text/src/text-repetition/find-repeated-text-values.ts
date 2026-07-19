export type RepeatedTextValue = {
  readonly count: number;
  readonly value: string;
};

export type FindRepeatedTextValuesProps = {
  readonly minOccurrences: number;
  readonly values: readonly string[];
};

export const findRepeatedTextValues = (
  props: FindRepeatedTextValuesProps,
): readonly RepeatedTextValue[] => {
  const { minOccurrences, values } = props;
  const countsByValue = values.reduce<Map<string, number>>((counts, value) => {
    const currentCount = counts.get(value) ?? 0;
    counts.set(value, currentCount + 1);
    return counts;
  }, new Map());
  const result = Array.from(countsByValue.entries())
    .flatMap(([value, count]) => {
      if (count < minOccurrences) {
        const result: readonly RepeatedTextValue[] = [];
        return result;
      }

      const result: readonly RepeatedTextValue[] = [{ count, value }];
      return result;
    })
    .toSorted((left, right) => {
      const countDifference = right.count - left.count;

      if (countDifference !== 0) {
        return countDifference;
      }

      return left.value.localeCompare(right.value);
    });

  return result;
};
