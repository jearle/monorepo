import { expect, test } from 'bun:test';

import {
  BALANCED_SUBSET_DECISION_STATUS_SELECTED,
  BALANCED_SUBSET_REASON_BUCKET_TARGET_MISSING,
  BALANCED_SUBSET_REASON_SELECTED,
  createBalancedSubsetDecision,
  createBalancedSubsetReasonCode,
} from '.';

test(`creates balanced subset reason codes and decisions from shared helpers`, () => {
  const bucketTargets = [
    {
      bucketId: `alpha`,
      targetCount: 1,
      weight: 1,
    },
  ];
  const selectedCandidate = {
    bucketId: `alpha`,
    id: `alpha-1`,
    score: 1,
  };
  const selectedCandidates = [selectedCandidate];
  const selectedIds = selectedCandidates.map((candidate) => {
    return candidate.id;
  });
  const selectedReasonCode = createBalancedSubsetReasonCode({
    bucketTargets,
    candidate: selectedCandidate,
    normalizedTargetCount: 1,
    selectedCandidates,
    selectedIds,
  });
  const missingBucketReasonCode = createBalancedSubsetReasonCode({
    bucketTargets,
    candidate: {
      bucketId: `beta`,
      id: `beta-1`,
      score: 0.9,
    },
    normalizedTargetCount: 1,
    selectedCandidates,
    selectedIds,
  });
  const selectedDecision = createBalancedSubsetDecision({
    bucketTargets,
    candidate: selectedCandidate,
    normalizedTargetCount: 1,
    selectedCandidates,
    selectedIds,
  });

  expect(selectedReasonCode).toBe(BALANCED_SUBSET_REASON_SELECTED);
  expect(missingBucketReasonCode).toBe(
    BALANCED_SUBSET_REASON_BUCKET_TARGET_MISSING,
  );
  expect(selectedDecision).toMatchObject({
    reason: {
      code: BALANCED_SUBSET_REASON_SELECTED,
      selectedCount: 1,
      targetCount: 1,
    },
    status: BALANCED_SUBSET_DECISION_STATUS_SELECTED,
  });
});
