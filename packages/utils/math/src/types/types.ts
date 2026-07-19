export type Vector = readonly number[];

export type VectorCollection = readonly Vector[];

export type SimilarityMatrix = readonly (readonly number[])[];

export type DistributionSummary = {
  readonly min: number;
  readonly median: number;
  readonly p95: number;
  readonly max: number;
};
