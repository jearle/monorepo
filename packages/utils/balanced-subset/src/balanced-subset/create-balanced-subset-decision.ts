import {
  BALANCED_SUBSET_DECISION_STATUS_SELECTED,
  BALANCED_SUBSET_DECISION_STATUS_SKIPPED,
} from './constants';
import { createBalancedSubsetReasonCode } from './create-balanced-subset-reason-code';
import { getBucketTargetCount } from './get-bucket-target-count';
import { getSelectedBucketCount } from './get-selected-bucket-count';
import {
  type BalancedSubsetBucketTarget,
  type BalancedSubsetCandidate,
  type BalancedSubsetDecision,
} from './types';

export type CreateBalancedSubsetDecisionProps = {
  readonly bucketTargets: readonly BalancedSubsetBucketTarget[];
  readonly candidate: BalancedSubsetCandidate;
  readonly normalizedTargetCount: number;
  readonly selectedCandidates: readonly BalancedSubsetCandidate[];
  readonly selectedIds: readonly string[];
};

export const createBalancedSubsetDecision = (
  props: CreateBalancedSubsetDecisionProps,
) => {
  const {
    bucketTargets,
    candidate,
    normalizedTargetCount,
    selectedCandidates,
    selectedIds,
  } = props;
  const isSelected = selectedIds.includes(candidate.id);
  const status = isSelected
    ? BALANCED_SUBSET_DECISION_STATUS_SELECTED
    : BALANCED_SUBSET_DECISION_STATUS_SKIPPED;
  const reasonCode = createBalancedSubsetReasonCode({
    bucketTargets,
    candidate,
    normalizedTargetCount,
    selectedCandidates,
    selectedIds,
  });
  const selectedCount = getSelectedBucketCount({
    bucketId: candidate.bucketId,
    selectedCandidates,
  });
  const targetCount = getBucketTargetCount({
    bucketId: candidate.bucketId,
    bucketTargets,
  });
  const result: BalancedSubsetDecision = {
    bucketId: candidate.bucketId,
    id: candidate.id,
    reason: {
      bucketId: candidate.bucketId,
      code: reasonCode,
      selectedCount,
      targetCount,
    },
    score: candidate.score,
    status,
  };

  return result;
};
