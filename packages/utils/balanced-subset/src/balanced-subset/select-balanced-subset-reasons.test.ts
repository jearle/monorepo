import { expect, test } from 'bun:test';

import {
  BALANCED_SUBSET_DECISION_STATUS_SELECTED,
  BALANCED_SUBSET_DECISION_STATUS_SKIPPED,
  BALANCED_SUBSET_REASON_BUCKET_TARGET_FILLED,
  BALANCED_SUBSET_REASON_HARD_REJECTED,
  selectBalancedSubset,
} from '.';

test(`skips hard rejected candidates with structured reasons`, () => {
  const result = selectBalancedSubset({
    buckets: [
      {
        id: `alpha`,
        weight: 1,
      },
    ],
    candidates: [
      {
        bucketId: `alpha`,
        hardRejected: true,
        id: `alpha-rejected`,
        score: 1,
      },
      {
        bucketId: `alpha`,
        id: `alpha-selected`,
        score: 0.1,
      },
    ],
    targetCount: 1,
  });
  const rejectedDecision = result.decisions.find((decision) => {
    return decision.id === `alpha-rejected`;
  });
  const selectedDecision = result.decisions.find((decision) => {
    return decision.id === `alpha-selected`;
  });

  expect(result.selectedIds).toEqual([`alpha-selected`]);
  expect(result.skippedIds).toEqual([`alpha-rejected`]);
  expect(rejectedDecision).toMatchObject({
    reason: {
      code: BALANCED_SUBSET_REASON_HARD_REJECTED,
    },
    status: BALANCED_SUBSET_DECISION_STATUS_SKIPPED,
  });
  expect(selectedDecision).toMatchObject({
    status: BALANCED_SUBSET_DECISION_STATUS_SELECTED,
  });
});

test(`marks extra candidates skipped when bucket targets are filled`, () => {
  const result = selectBalancedSubset({
    buckets: [
      {
        id: `alpha`,
        weight: 1,
      },
    ],
    candidates: [
      {
        bucketId: `alpha`,
        id: `alpha-1`,
        score: 1,
      },
      {
        bucketId: `alpha`,
        id: `alpha-2`,
        score: 0.5,
      },
    ],
    targetCount: 1,
  });
  const skippedDecision = result.decisions.find((decision) => {
    return decision.id === `alpha-2`;
  });

  expect(skippedDecision).toMatchObject({
    reason: {
      code: BALANCED_SUBSET_REASON_BUCKET_TARGET_FILLED,
      selectedCount: 1,
      targetCount: 1,
    },
    status: BALANCED_SUBSET_DECISION_STATUS_SKIPPED,
  });
});
