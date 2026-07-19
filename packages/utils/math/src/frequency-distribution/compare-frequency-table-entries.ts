import { type FrequencyTableEntry } from './types';

export type CompareFrequencyTableEntriesProps = {
  readonly entry1: FrequencyTableEntry;
  readonly entry2: FrequencyTableEntry;
};

export const compareFrequencyTableEntries = (
  props: CompareFrequencyTableEntriesProps,
) => {
  const { entry1, entry2 } = props;
  const countDifference = entry2.count - entry1.count;
  const hasDifferentCounts = countDifference !== 0;

  if (hasDifferentCounts) {
    return countDifference;
  }

  const entry1ComesFirst = entry1.value < entry2.value;

  if (entry1ComesFirst) {
    return -1;
  }

  const entry2ComesFirst = entry1.value > entry2.value;

  if (entry2ComesFirst) {
    return 1;
  }

  return 0;
};
