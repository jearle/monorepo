import { round } from '../round';

import { compareFrequencyTableEntries } from './compare-frequency-table-entries';
import { FREQUENCY_DISTRIBUTION_DEFAULT_PRECISION } from './constants';
import { type FrequencyTableEntry } from './types';

export type CreateFrequencyTableProps = {
  readonly precision?: number;
  readonly values: readonly string[];
};

export const createFrequencyTable = (props: CreateFrequencyTableProps) => {
  const { precision = FREQUENCY_DISTRIBUTION_DEFAULT_PRECISION, values } =
    props;
  const totalCount = values.length;
  const uniqueValues = Array.from(new Set(values));
  const frequencyTable = uniqueValues
    .map((value) => {
      const matchingValues = values.filter((candidateValue) => {
        return candidateValue === value;
      });
      const count = matchingValues.length;
      const rawShare = totalCount === 0 ? 0 : count / totalCount;
      const share = round(rawShare, { precision });
      const entry: FrequencyTableEntry = {
        count,
        share,
        value,
      };

      return entry;
    })
    .toSorted((entry1, entry2) => {
      const result = compareFrequencyTableEntries({ entry1, entry2 });

      return result;
    });

  return frequencyTable;
};
