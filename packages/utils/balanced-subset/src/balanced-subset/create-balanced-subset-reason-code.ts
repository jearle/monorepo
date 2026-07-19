import {
  BALANCED_SUBSET_REASON_BUCKET_TARGET_FILLED,
  BALANCED_SUBSET_REASON_BUCKET_TARGET_MISSING,
  BALANCED_SUBSET_REASON_HARD_REJECTED,
  BALANCED_SUBSET_REASON_SELECTED,
  BALANCED_SUBSET_REASON_SUBSET_TARGET_FILLED,
} from './constants';
import { checkHasBucketTarget } from './check-has-bucket-target';
import { getBucketTargetCount } from './get-bucket-target-count';
import { getSelectedBucketCount } from './get-selected-bucket-count';
import {
  type BalancedSubsetBucketTarget,
  type BalancedSubsetCandidate,
  type BalancedSubsetReasonCode,
} from './types';

export type CreateBalancedSubsetReasonCodeProps = {
  readonly bucketTargets: readonly BalancedSubsetBucketTarget[];
  readonly candidate: BalancedSubsetCandidate;
  readonly normalizedTargetCount: number;
  readonly selectedCandidates: readonly BalancedSubsetCandidate[];
  readonly selectedIds: readonly string[];
};

export const createBalancedSubsetReasonCode = (
  props: CreateBalancedSubsetReasonCodeProps,
) => {
  const {
    bucketTargets,
    candidate,
    normalizedTargetCount,
    selectedCandidates,
    selectedIds,
  } = props;
  const isSelected = selectedIds.includes(candidate.id);

  if (isSelected) {
    const result: BalancedSubsetReasonCode = BALANCED_SUBSET_REASON_SELECTED;

    return result;
  }

  const isHardRejected = candidate.hardRejected === true;

  if (isHardRejected) {
    const result: BalancedSubsetReasonCode =
      BALANCED_SUBSET_REASON_HARD_REJECTED;

    return result;
  }

  const hasBucketTarget = checkHasBucketTarget({
    bucketId: candidate.bucketId,
    bucketTargets,
  });

  if (hasBucketTarget === false) {
    const result: BalancedSubsetReasonCode =
      BALANCED_SUBSET_REASON_BUCKET_TARGET_MISSING;

    return result;
  }

  const bucketTargetCount = getBucketTargetCount({
    bucketId: candidate.bucketId,
    bucketTargets,
  });
  const selectedBucketCount = getSelectedBucketCount({
    bucketId: candidate.bucketId,
    selectedCandidates,
  });
  const hasFilledBucketTarget = selectedBucketCount >= bucketTargetCount;

  if (hasFilledBucketTarget) {
    const result: BalancedSubsetReasonCode =
      BALANCED_SUBSET_REASON_BUCKET_TARGET_FILLED;

    return result;
  }

  const hasFilledSubsetTarget =
    selectedCandidates.length >= normalizedTargetCount;

  if (hasFilledSubsetTarget) {
    const result: BalancedSubsetReasonCode =
      BALANCED_SUBSET_REASON_SUBSET_TARGET_FILLED;

    return result;
  }

  const result: BalancedSubsetReasonCode =
    BALANCED_SUBSET_REASON_SUBSET_TARGET_FILLED;

  return result;
};
