import { createFrequencyTable } from './create-frequency-table';
import { normalizeFrequencyLimit } from './normalize-frequency-limit';

export type GetTopFrequenciesProps = {
  readonly limit: number;
  readonly precision?: number;
  readonly values: readonly string[];
};

export const getTopFrequencies = (props: GetTopFrequenciesProps) => {
  const { limit, precision, values } = props;
  const frequencyTable = createFrequencyTable({ precision, values });
  const normalizedLimit = normalizeFrequencyLimit({ limit });
  const result = frequencyTable.slice(0, normalizedLimit);

  return result;
};
