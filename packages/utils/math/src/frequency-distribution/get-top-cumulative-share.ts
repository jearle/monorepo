import { round } from '../round';

import { FREQUENCY_DISTRIBUTION_DEFAULT_PRECISION } from './constants';
import { getTopFrequencies } from './get-top-frequencies';

export type GetTopCumulativeShareProps = {
  readonly limit: number;
  readonly precision?: number;
  readonly values: readonly string[];
};

export const getTopCumulativeShare = (props: GetTopCumulativeShareProps) => {
  const {
    limit,
    precision = FREQUENCY_DISTRIBUTION_DEFAULT_PRECISION,
    values,
  } = props;
  const totalCount = values.length;
  const hasNoValues = totalCount === 0;

  if (hasNoValues) {
    return 0;
  }

  const topFrequencies = getTopFrequencies({ limit, precision, values });
  const topCount = topFrequencies.reduce((currentCount, entry) => {
    const nextCount = currentCount + entry.count;

    return nextCount;
  }, 0);
  const rawTopCumulativeShare = topCount / totalCount;
  const result = round(rawTopCumulativeShare, { precision });

  return result;
};
