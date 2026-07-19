import { type BalancedSubsetBucketTarget } from './types';

export type CheckHasBucketTargetProps = {
  readonly bucketId: string;
  readonly bucketTargets: readonly BalancedSubsetBucketTarget[];
};

export const checkHasBucketTarget = (props: CheckHasBucketTargetProps) => {
  const { bucketId, bucketTargets } = props;
  const bucketTarget = bucketTargets.find((target) => {
    return target.bucketId === bucketId;
  });
  const result = bucketTarget !== undefined;

  return result;
};
