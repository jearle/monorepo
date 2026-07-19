import { round } from '../round';

import { FREQUENCY_DISTRIBUTION_DEFAULT_PRECISION } from './constants';
import { createFrequencyTable } from './create-frequency-table';

export type GetNormalizedEntropyProps = {
  readonly precision?: number;
  readonly values: readonly string[];
};

export const getNormalizedEntropy = (props: GetNormalizedEntropyProps) => {
  const { precision = FREQUENCY_DISTRIBUTION_DEFAULT_PRECISION, values } =
    props;
  const totalCount = values.length;
  const hasNoValues = totalCount === 0;

  if (hasNoValues) {
    return 0;
  }

  const frequencyTable = createFrequencyTable({ precision, values });
  const uniqueValueCount = frequencyTable.length;
  const hasNoDiversity = uniqueValueCount <= 1;

  if (hasNoDiversity) {
    return 0;
  }

  const entropy = frequencyTable.reduce((currentEntropy, entry) => {
    const probability = entry.count / totalCount;
    const informationContent = Math.log2(probability);
    const weightedInformationContent = probability * informationContent;
    const nextEntropy = currentEntropy - weightedInformationContent;

    return nextEntropy;
  }, 0);
  const maximumEntropy = Math.log2(uniqueValueCount);
  const rawNormalizedEntropy = entropy / maximumEntropy;
  const result = round(rawNormalizedEntropy, { precision });

  return result;
};
