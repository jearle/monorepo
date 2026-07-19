import { getSelectedBucketCount } from './get-selected-bucket-count';
import {
  type BalancedSubsetBucketCount,
  type BalancedSubsetBucketTarget,
  type BalancedSubsetCandidate,
} from './types';

export type CreateSelectedCountsProps = {
  readonly bucketTargets: readonly BalancedSubsetBucketTarget[];
  readonly selectedCandidates: readonly BalancedSubsetCandidate[];
};

export const createSelectedCounts = (props: CreateSelectedCountsProps) => {
  const { bucketTargets, selectedCandidates } = props;
  const selectedCounts = bucketTargets.map((target) => {
    const count = getSelectedBucketCount({
      bucketId: target.bucketId,
      selectedCandidates,
    });
    const result: BalancedSubsetBucketCount = {
      bucketId: target.bucketId,
      count,
    };

    return result;
  });

  return selectedCounts;
};
