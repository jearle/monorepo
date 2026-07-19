import { normalizeBalancedSubsetCount } from './normalize-balanced-subset-count';
import {
  type BalancedSubsetBucket,
  type BalancedSubsetBucketTarget,
} from './types';

type BucketAllocation = {
  readonly bucketId: string;
  readonly floorTargetCount: number;
  readonly remainder: number;
  readonly weight: number;
};
type NormalizeBucketWeightProps = {
  readonly weight: number;
};
const normalizeBucketWeight = (props: NormalizeBucketWeightProps) => {
  const { weight } = props;
  const isFiniteWeight = Number.isFinite(weight);

  if (isFiniteWeight === false) {
    return 0;
  }

  const result = Math.max(0, weight);

  return result;
};
type CompareBucketIdsProps = {
  readonly bucketId1: string;
  readonly bucketId2: string;
};

const compareBucketIds = (props: CompareBucketIdsProps) => {
  const { bucketId1, bucketId2 } = props;
  const bucket1ComesFirst = bucketId1 < bucketId2;

  if (bucket1ComesFirst) {
    return -1;
  }

  const bucket2ComesFirst = bucketId1 > bucketId2;

  if (bucket2ComesFirst) {
    return 1;
  }

  return 0;
};

type CompareBucketAllocationsProps = {
  readonly allocation1: BucketAllocation;
  readonly allocation2: BucketAllocation;
};

const compareBucketAllocations = (props: CompareBucketAllocationsProps) => {
  const { allocation1, allocation2 } = props;
  const remainderDifference = allocation2.remainder - allocation1.remainder;
  const hasDifferentRemainders = remainderDifference !== 0;

  if (hasDifferentRemainders) {
    return remainderDifference;
  }

  const result = compareBucketIds({
    bucketId1: allocation1.bucketId,
    bucketId2: allocation2.bucketId,
  });

  return result;
};

type CreateBucketAllocationProps = {
  readonly bucket: BalancedSubsetBucket;
  readonly targetCount: number;
  readonly totalWeight: number;
  readonly weight: number;
};

const createBucketAllocation = (props: CreateBucketAllocationProps) => {
  const { bucket, targetCount, totalWeight, weight } = props;
  const rawTargetCount = targetCount * (weight / totalWeight);
  const floorTargetCount = Math.floor(rawTargetCount);
  const remainder = rawTargetCount - floorTargetCount;
  const result: BucketAllocation = {
    bucketId: bucket.id,
    floorTargetCount,
    remainder,
    weight,
  };

  return result;
};

export type AllocateBucketTargetsProps = {
  readonly buckets: readonly BalancedSubsetBucket[];
  readonly targetCount: number;
};

export const allocateBucketTargets = (props: AllocateBucketTargetsProps) => {
  const { buckets, targetCount } = props;
  const hasExplicitTargetCounts = buckets.some((bucket) => {
    return bucket.targetCount !== undefined;
  });
  const normalizedTargetCount = normalizeBalancedSubsetCount({
    count: targetCount,
  });
  const sortedBuckets = buckets.toSorted((bucket1, bucket2) => {
    const result = compareBucketIds({
      bucketId1: bucket1.id,
      bucketId2: bucket2.id,
    });

    return result;
  });

  if (hasExplicitTargetCounts) {
    return sortedBuckets.map((bucket) => {
      const result = {
        bucketId: bucket.id,
        targetCount: normalizeBalancedSubsetCount({
          count: bucket.targetCount ?? 0,
        }),
        weight: normalizeBucketWeight({ weight: bucket.weight }),
      };
      return result;
    });
  }

  const normalizedWeights = sortedBuckets.map((bucket) => {
    return normalizeBucketWeight({ weight: bucket.weight });
  });
  const normalizedTotalWeight = normalizedWeights.reduce(
    (currentTotal, weight) => {
      const nextTotal = currentTotal + weight;

      return nextTotal;
    },
    0,
  );
  const hasNoPositiveWeight = normalizedTotalWeight === 0;
  const effectiveWeights = hasNoPositiveWeight
    ? sortedBuckets.map(() => {
        return 1;
      })
    : normalizedWeights;
  const effectiveTotalWeight = effectiveWeights.reduce(
    (currentTotal, weight) => {
      const nextTotal = currentTotal + weight;

      return nextTotal;
    },
    0,
  );
  const bucketAllocations = sortedBuckets.map((bucket, bucketIndex) => {
    const weight = effectiveWeights[bucketIndex] ?? 0;
    const result = createBucketAllocation({
      bucket,
      targetCount: normalizedTargetCount,
      totalWeight: effectiveTotalWeight,
      weight,
    });

    return result;
  });
  const allocatedCount = bucketAllocations.reduce(
    (currentCount, allocation) => {
      const nextCount = currentCount + allocation.floorTargetCount;

      return nextCount;
    },
    0,
  );
  const remainingCount = normalizedTargetCount - allocatedCount;
  const rankedAllocations = bucketAllocations.toSorted(
    (allocation1, allocation2) => {
      const result = compareBucketAllocations({ allocation1, allocation2 });

      return result;
    },
  );
  const bonusBucketIds = rankedAllocations
    .slice(0, remainingCount)
    .map((allocation) => {
      return allocation.bucketId;
    });
  const bucketTargets = bucketAllocations.map((allocation) => {
    const hasBonusTarget = bonusBucketIds.includes(allocation.bucketId);
    const bonusTargetCount = hasBonusTarget ? 1 : 0;
    const targetCountValue = allocation.floorTargetCount + bonusTargetCount;
    const result: BalancedSubsetBucketTarget = {
      bucketId: allocation.bucketId,
      targetCount: targetCountValue,
      weight: allocation.weight,
    };

    return result;
  });

  return bucketTargets;
};
