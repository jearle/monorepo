import { type BalancedSubsetBucketTarget } from './types';

export type GetBucketTargetCountProps = {
  readonly bucketId: string;
  readonly bucketTargets: readonly BalancedSubsetBucketTarget[];
};

export const getBucketTargetCount = (props: GetBucketTargetCountProps) => {
  const { bucketId, bucketTargets } = props;
  const bucketTarget = bucketTargets.find((target) => {
    return target.bucketId === bucketId;
  });
  const result = bucketTarget?.targetCount ?? 0;

  return result;
};
