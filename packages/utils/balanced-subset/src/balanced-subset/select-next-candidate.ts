import { checkIsEligibleCandidate } from './check-is-eligible-candidate';
import { compareBalancedSubsetCandidates } from './compare-balanced-subset-candidates';
import { createSelectedCounts } from './create-selected-counts';
import { scoreCoverageGaps } from './score-coverage-gaps';
import {
  type BalancedSubsetBucketTarget,
  type BalancedSubsetCandidate,
} from './types';

export type SelectNextCandidateProps = {
  readonly bucketTargets: readonly BalancedSubsetBucketTarget[];
  readonly candidates: readonly BalancedSubsetCandidate[];
  readonly selectedCandidates: readonly BalancedSubsetCandidate[];
};

export const selectNextCandidate = (props: SelectNextCandidateProps) => {
  const { bucketTargets, candidates, selectedCandidates } = props;
  const selectedIds = selectedCandidates.map((candidate) => {
    return candidate.id;
  });
  const selectedCounts = createSelectedCounts({
    bucketTargets,
    selectedCandidates,
  });
  const coverageGaps = scoreCoverageGaps({
    selectedCounts,
    targets: bucketTargets,
  });
  const eligibleCandidates = candidates.filter((candidate) => {
    const result = checkIsEligibleCandidate({
      bucketTargets,
      candidate,
      selectedCandidates,
      selectedIds,
    });

    return result;
  });
  const rankedCandidates = eligibleCandidates.toSorted(
    (candidate1, candidate2) => {
      const result = compareBalancedSubsetCandidates({
        candidate1,
        candidate2,
        coverageGaps,
      });

      return result;
    },
  );
  const [result = null] = rankedCandidates;

  return result;
};
