import {
  type BALANCED_SUBSET_DECISION_STATUSES,
  type BALANCED_SUBSET_REASON_CODES,
} from './constants';

export type BalancedSubsetBucket = {
  readonly id: string;
  readonly targetCount?: number;
  readonly weight: number;
};

export type BalancedSubsetBucketTarget = {
  readonly bucketId: string;
  readonly targetCount: number;
  readonly weight: number;
};

export type BalancedSubsetBucketCount = {
  readonly bucketId: string;
  readonly count: number;
};

export type BalancedSubsetCoverageGap = {
  readonly bucketId: string;
  readonly coverageShare: number;
  readonly gapCount: number;
  readonly gapScore: number;
  readonly selectedCount: number;
  readonly targetCount: number;
};

export type BalancedSubsetCandidate = {
  readonly bucketId: string;
  readonly hardRejected?: boolean;
  readonly id: string;
  readonly score: number;
};

export type BalancedSubsetDecisionStatus =
  (typeof BALANCED_SUBSET_DECISION_STATUSES)[number];

export type BalancedSubsetReasonCode =
  (typeof BALANCED_SUBSET_REASON_CODES)[number];

export type BalancedSubsetDecisionReason = {
  readonly bucketId: string;
  readonly code: BalancedSubsetReasonCode;
  readonly selectedCount: number;
  readonly targetCount: number;
};

export type BalancedSubsetDecision = {
  readonly bucketId: string;
  readonly id: string;
  readonly reason: BalancedSubsetDecisionReason;
  readonly score: number;
  readonly status: BalancedSubsetDecisionStatus;
};

export type SelectBalancedSubsetResult = {
  readonly bucketTargets: readonly BalancedSubsetBucketTarget[];
  readonly coverageGaps: readonly BalancedSubsetCoverageGap[];
  readonly decisions: readonly BalancedSubsetDecision[];
  readonly selectedIds: readonly string[];
  readonly skippedIds: readonly string[];
};
