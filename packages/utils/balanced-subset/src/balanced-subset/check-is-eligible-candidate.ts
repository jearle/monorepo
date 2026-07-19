import { getBucketTargetCount } from './get-bucket-target-count';
import { getSelectedBucketCount } from './get-selected-bucket-count';
import {
  type BalancedSubsetBucketTarget,
  type BalancedSubsetCandidate,
} from './types';

export type CheckIsEligibleCandidateProps = {
  readonly bucketTargets: readonly BalancedSubsetBucketTarget[];
  readonly candidate: BalancedSubsetCandidate;
  readonly selectedCandidates: readonly BalancedSubsetCandidate[];
  readonly selectedIds: readonly string[];
};

export const checkIsEligibleCandidate = (
  props: CheckIsEligibleCandidateProps,
) => {
  const { bucketTargets, candidate, selectedCandidates, selectedIds } = props;
  const isAlreadySelected = selectedIds.includes(candidate.id);

  if (isAlreadySelected) {
    return false;
  }

  const isHardRejected = candidate.hardRejected === true;

  if (isHardRejected) {
    return false;
  }

  const bucketTargetCount = getBucketTargetCount({
    bucketId: candidate.bucketId,
    bucketTargets,
  });
  const selectedBucketCount = getSelectedBucketCount({
    bucketId: candidate.bucketId,
    selectedCandidates,
  });
  const hasBucketCapacity = selectedBucketCount < bucketTargetCount;
  const result = hasBucketCapacity;

  return result;
};
