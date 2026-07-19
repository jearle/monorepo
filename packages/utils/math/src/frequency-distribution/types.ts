export type FrequencyTableEntry = {
  readonly count: number;
  readonly share: number;
  readonly value: string;
};

export type FrequencyTable = readonly FrequencyTableEntry[];

export type FrequencyDistributionSummary = {
  readonly frequencyTable: FrequencyTable;
  readonly normalizedEntropy: number;
  readonly topCumulativeShare: number;
  readonly topFrequencies: FrequencyTable;
  readonly totalCount: number;
  readonly uniqueValueCount: number;
};
