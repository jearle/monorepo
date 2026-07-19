import { expect, test } from 'bun:test';

import { selectBalancedSubset } from '.';

test(`selects a balanced subset before lower-priority same-bucket candidates`, () => {
  const result = selectBalancedSubset({
    buckets: [
      {
        id: `alpha`,
        weight: 1,
      },
      {
        id: `beta`,
        weight: 1,
      },
    ],
    candidates: [
      {
        bucketId: `alpha`,
        id: `alpha-1`,
        score: 0.9,
      },
      {
        bucketId: `alpha`,
        id: `alpha-2`,
        score: 0.8,
      },
      {
        bucketId: `alpha`,
        id: `alpha-3`,
        score: 0.7,
      },
      {
        bucketId: `beta`,
        id: `beta-1`,
        score: 0.6,
      },
      {
        bucketId: `beta`,
        id: `beta-2`,
        score: 0.5,
      },
      {
        bucketId: `beta`,
        id: `beta-3`,
        score: 0.4,
      },
    ],
    targetCount: 4,
  });

  expect(result.selectedIds).toEqual([
    `alpha-1`,
    `beta-1`,
    `alpha-2`,
    `beta-2`,
  ]);
  expect(result.skippedIds).toEqual([`alpha-3`, `beta-3`]);
  expect(result.coverageGaps).toEqual([
    {
      bucketId: `alpha`,
      coverageShare: 1,
      gapCount: 0,
      gapScore: 0,
      selectedCount: 2,
      targetCount: 2,
    },
    {
      bucketId: `beta`,
      coverageShare: 1,
      gapCount: 0,
      gapScore: 0,
      selectedCount: 2,
      targetCount: 2,
    },
  ]);
});

test(`reports insufficient coverage when candidates cannot fill a bucket target`, () => {
  const result = selectBalancedSubset({
    buckets: [
      {
        id: `alpha`,
        weight: 1,
      },
      {
        id: `beta`,
        weight: 1,
      },
    ],
    candidates: [
      {
        bucketId: `alpha`,
        id: `alpha-1`,
        score: 0.9,
      },
      {
        bucketId: `alpha`,
        id: `alpha-2`,
        score: 0.8,
      },
    ],
    targetCount: 4,
  });

  expect(result.selectedIds).toEqual([`alpha-1`, `alpha-2`]);
  expect(result.coverageGaps).toEqual([
    {
      bucketId: `beta`,
      coverageShare: 0,
      gapCount: 2,
      gapScore: 1,
      selectedCount: 0,
      targetCount: 2,
    },
    {
      bucketId: `alpha`,
      coverageShare: 1,
      gapCount: 0,
      gapScore: 0,
      selectedCount: 2,
      targetCount: 2,
    },
  ]);
});
