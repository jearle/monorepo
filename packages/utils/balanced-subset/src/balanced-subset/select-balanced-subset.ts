import { BALANCED_SUBSET_DECISION_STATUS_SKIPPED } from './constants';
import { allocateBucketTargets } from './allocate-bucket-targets';
import { createSelectedCounts } from './create-selected-counts';
import { createBalancedSubsetDecision } from './create-balanced-subset-decision';
import { normalizeBalancedSubsetCount } from './normalize-balanced-subset-count';
import { scoreCoverageGaps } from './score-coverage-gaps';
import { selectNextCandidate } from './select-next-candidate';
import {
  type BalancedSubsetBucket,
  type BalancedSubsetCandidate,
  type BalancedSubsetDecision,
  type SelectBalancedSubsetResult,
} from './types';

type CompareBalancedSubsetDecisionIdsProps = {
  readonly decision1: BalancedSubsetDecision;
  readonly decision2: BalancedSubsetDecision;
};

const compareBalancedSubsetDecisionIds = (
  props: CompareBalancedSubsetDecisionIdsProps,
) => {
  const { decision1, decision2 } = props;
  const decision1ComesFirst = decision1.id < decision2.id;

  if (decision1ComesFirst) {
    return -1;
  }

  const decision2ComesFirst = decision1.id > decision2.id;

  if (decision2ComesFirst) {
    return 1;
  }

  return 0;
};

export type SelectBalancedSubsetProps = {
  readonly buckets: readonly BalancedSubsetBucket[];
  readonly candidates: readonly BalancedSubsetCandidate[];
  readonly targetCount: number;
};

export const selectBalancedSubset = (props: SelectBalancedSubsetProps) => {
  const { buckets, candidates, targetCount } = props;
  const normalizedTargetCount = normalizeBalancedSubsetCount({
    count: targetCount,
  });
  const bucketTargets = allocateBucketTargets({
    buckets,
    targetCount: normalizedTargetCount,
  });
  const subsetSlots = Array.from({ length: normalizedTargetCount });
  const initialSelectedCandidates: readonly BalancedSubsetCandidate[] = [];
  const selectedCandidates = subsetSlots.reduce<
    readonly BalancedSubsetCandidate[]
  >((currentSelectedCandidates) => {
    const hasFilledTarget =
      currentSelectedCandidates.length >= normalizedTargetCount;

    if (hasFilledTarget) {
      return currentSelectedCandidates;
    }

    const nextCandidate = selectNextCandidate({
      bucketTargets,
      candidates,
      selectedCandidates: currentSelectedCandidates,
    });

    if (nextCandidate === null) {
      return currentSelectedCandidates;
    }

    const result = [...currentSelectedCandidates, nextCandidate];

    return result;
  }, initialSelectedCandidates);
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
  const decisions = candidates
    .map((candidate) => {
      const result = createBalancedSubsetDecision({
        bucketTargets,
        candidate,
        normalizedTargetCount,
        selectedCandidates,
        selectedIds,
      });

      return result;
    })
    .toSorted((decision1, decision2) => {
      const result = compareBalancedSubsetDecisionIds({ decision1, decision2 });

      return result;
    });
  const skippedIds = decisions
    .filter((decision) => {
      return decision.status === BALANCED_SUBSET_DECISION_STATUS_SKIPPED;
    })
    .map((decision) => {
      return decision.id;
    });
  const result: SelectBalancedSubsetResult = {
    bucketTargets,
    coverageGaps,
    decisions,
    selectedIds,
    skippedIds,
  };

  return result;
};
