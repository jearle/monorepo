import { FREQUENCY_DISTRIBUTION_DEFAULT_PRECISION } from './constants';
import { createFrequencyTable } from './create-frequency-table';
import { getNormalizedEntropy } from './get-normalized-entropy';
import { getTopCumulativeShare } from './get-top-cumulative-share';
import { getTopFrequencies } from './get-top-frequencies';
import { type FrequencyDistributionSummary } from './types';

export type SummarizeFrequencyDistributionProps = {
  readonly precision?: number;
  readonly topLimit: number;
  readonly values: readonly string[];
};

export const summarizeFrequencyDistribution = (
  props: SummarizeFrequencyDistributionProps,
) => {
  const {
    precision = FREQUENCY_DISTRIBUTION_DEFAULT_PRECISION,
    topLimit,
    values,
  } = props;
  const frequencyTable = createFrequencyTable({ precision, values });
  const topFrequencies = getTopFrequencies({
    limit: topLimit,
    precision,
    values,
  });
  const topCumulativeShare = getTopCumulativeShare({
    limit: topLimit,
    precision,
    values,
  });
  const normalizedEntropy = getNormalizedEntropy({ precision, values });
  const summary: FrequencyDistributionSummary = {
    frequencyTable,
    normalizedEntropy,
    topCumulativeShare,
    topFrequencies,
    totalCount: values.length,
    uniqueValueCount: frequencyTable.length,
  };
  const result = summary;

  return result;
};
