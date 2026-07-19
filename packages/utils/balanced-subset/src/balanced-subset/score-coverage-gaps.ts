import { normalizeBalancedSubsetCount } from './normalize-balanced-subset-count';
import {
  type BalancedSubsetBucketCount,
  type BalancedSubsetBucketTarget,
  type BalancedSubsetCoverageGap,
} from './types';

type GetSelectedCountProps = {
  readonly bucketId: string;
  readonly selectedCounts: readonly BalancedSubsetBucketCount[];
};

const getSelectedCount = (props: GetSelectedCountProps) => {
  const { bucketId, selectedCounts } = props;
  const bucketCount = selectedCounts.find((selectedCount) => {
    return selectedCount.bucketId === bucketId;
  });
  const rawCount = bucketCount?.count ?? 0;
  const result = normalizeBalancedSubsetCount({ count: rawCount });

  return result;
};

type CompareCoverageGapsProps = {
  readonly gap1: BalancedSubsetCoverageGap;
  readonly gap2: BalancedSubsetCoverageGap;
};

const compareCoverageGaps = (props: CompareCoverageGapsProps) => {
  const { gap1, gap2 } = props;
  const scoreDifference = gap2.gapScore - gap1.gapScore;
  const hasDifferentScores = scoreDifference !== 0;

  if (hasDifferentScores) {
    return scoreDifference;
  }

  const countDifference = gap2.gapCount - gap1.gapCount;
  const hasDifferentCounts = countDifference !== 0;

  if (hasDifferentCounts) {
    return countDifference;
  }

  const gap1ComesFirst = gap1.bucketId < gap2.bucketId;

  if (gap1ComesFirst) {
    return -1;
  }

  const gap2ComesFirst = gap1.bucketId > gap2.bucketId;

  if (gap2ComesFirst) {
    return 1;
  }

  return 0;
};

type CreateCoverageGapProps = {
  readonly selectedCounts: readonly BalancedSubsetBucketCount[];
  readonly target: BalancedSubsetBucketTarget;
};

const createCoverageGap = (props: CreateCoverageGapProps) => {
  const { selectedCounts, target } = props;
  const targetCount = normalizeBalancedSubsetCount({
    count: target.targetCount,
  });
  const selectedCount = getSelectedCount({
    bucketId: target.bucketId,
    selectedCounts,
  });
  const rawGapCount = targetCount - selectedCount;
  const gapCount = Math.max(0, rawGapCount);
  const coverageShare =
    targetCount === 0 ? 1 : Math.min(1, selectedCount / targetCount);
  const gapScore = targetCount === 0 ? 0 : gapCount / targetCount;
  const result: BalancedSubsetCoverageGap = {
    bucketId: target.bucketId,
    coverageShare,
    gapCount,
    gapScore,
    selectedCount,
    targetCount,
  };

  return result;
};

export type ScoreCoverageGapsProps = {
  readonly selectedCounts: readonly BalancedSubsetBucketCount[];
  readonly targets: readonly BalancedSubsetBucketTarget[];
};

export const scoreCoverageGaps = (props: ScoreCoverageGapsProps) => {
  const { selectedCounts, targets } = props;
  const coverageGaps = targets
    .map((target) => {
      const result = createCoverageGap({ selectedCounts, target });

      return result;
    })
    .toSorted((gap1, gap2) => {
      const result = compareCoverageGaps({ gap1, gap2 });

      return result;
    });

  return coverageGaps;
};
