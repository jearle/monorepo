import {
  type BalancedSubsetCandidate,
  type BalancedSubsetCoverageGap,
} from './types';

type GetCandidateGapScoreProps = {
  readonly candidate: BalancedSubsetCandidate;
  readonly coverageGaps: readonly BalancedSubsetCoverageGap[];
};

const getCandidateGapScore = (props: GetCandidateGapScoreProps) => {
  const { candidate, coverageGaps } = props;
  const coverageGap = coverageGaps.find((gap) => {
    return gap.bucketId === candidate.bucketId;
  });
  const result = coverageGap?.gapScore ?? 0;

  return result;
};

type NormalizeCandidateScoreProps = {
  readonly score: number;
};

const normalizeCandidateScore = (props: NormalizeCandidateScoreProps) => {
  const { score } = props;
  const isFiniteScore = Number.isFinite(score);

  if (isFiniteScore) {
    return score;
  }

  return Number.NEGATIVE_INFINITY;
};

type CompareStringsProps = {
  readonly value1: string;
  readonly value2: string;
};

const compareStrings = (props: CompareStringsProps) => {
  const { value1, value2 } = props;
  const value1ComesFirst = value1 < value2;

  if (value1ComesFirst) {
    return -1;
  }

  const value2ComesFirst = value1 > value2;

  if (value2ComesFirst) {
    return 1;
  }

  return 0;
};

export type CompareBalancedSubsetCandidatesProps = {
  readonly candidate1: BalancedSubsetCandidate;
  readonly candidate2: BalancedSubsetCandidate;
  readonly coverageGaps?: readonly BalancedSubsetCoverageGap[];
};

export const compareBalancedSubsetCandidates = (
  props: CompareBalancedSubsetCandidatesProps,
) => {
  const { candidate1, candidate2, coverageGaps = [] } = props;
  const isCandidate1Rejected = candidate1.hardRejected === true;
  const isCandidate2Rejected = candidate2.hardRejected === true;

  if (isCandidate1Rejected !== isCandidate2Rejected) {
    return isCandidate1Rejected ? 1 : -1;
  }

  const gapScore1 = getCandidateGapScore({
    candidate: candidate1,
    coverageGaps,
  });
  const gapScore2 = getCandidateGapScore({
    candidate: candidate2,
    coverageGaps,
  });
  const gapScoreDifference = gapScore2 - gapScore1;
  const hasDifferentGapScores = gapScoreDifference !== 0;

  if (hasDifferentGapScores) {
    return gapScoreDifference;
  }

  const score1 = normalizeCandidateScore({ score: candidate1.score });
  const score2 = normalizeCandidateScore({ score: candidate2.score });
  const scoreDifference = score2 - score1;
  const hasDifferentScores = scoreDifference !== 0;

  if (hasDifferentScores) {
    return scoreDifference;
  }

  const idComparison = compareStrings({
    value1: candidate1.id,
    value2: candidate2.id,
  });
  const hasDifferentIds = idComparison !== 0;

  if (hasDifferentIds) {
    return idComparison;
  }

  const result = compareStrings({
    value1: candidate1.bucketId,
    value2: candidate2.bucketId,
  });

  return result;
};
