import { expect, test } from 'bun:test';

import {
  allocateBucketTargets,
  checkHasBucketTarget,
  createSelectedCounts,
  getBucketTargetCount,
  getSelectedBucketCount,
  scoreCoverageGaps,
} from '.';

test(`scores coverage gaps for insufficient coverage`, () => {
  const targets = allocateBucketTargets({
    buckets: [
      {
        id: `first`,
        weight: 1,
      },
      {
        id: `second`,
        weight: 1,
      },
    ],
    targetCount: 4,
  });
  const result = scoreCoverageGaps({
    selectedCounts: [
      {
        bucketId: `first`,
        count: 2,
      },
    ],
    targets,
  });

  expect(result).toEqual([
    {
      bucketId: `second`,
      coverageShare: 0,
      gapCount: 2,
      gapScore: 1,
      selectedCount: 0,
      targetCount: 2,
    },
    {
      bucketId: `first`,
      coverageShare: 1,
      gapCount: 0,
      gapScore: 0,
      selectedCount: 2,
      targetCount: 2,
    },
  ]);
});

test(`reads bucket target and selected counts from deterministic helper inputs`, () => {
  const bucketTargets = [
    {
      bucketId: `alpha`,
      targetCount: 2,
      weight: 1,
    },
    {
      bucketId: `beta`,
      targetCount: 1,
      weight: 1,
    },
  ];
  const selectedCandidates = [
    {
      bucketId: `alpha`,
      id: `alpha-1`,
      score: 0.9,
    },
    {
      bucketId: `gamma`,
      id: `gamma-1`,
      score: 0.7,
    },
  ];
  const selectedCounts = createSelectedCounts({
    bucketTargets,
    selectedCandidates,
  });

  expect(
    checkHasBucketTarget({
      bucketId: `alpha`,
      bucketTargets,
    }),
  ).toBe(true);
  expect(
    checkHasBucketTarget({
      bucketId: `gamma`,
      bucketTargets,
    }),
  ).toBe(false);
  expect(
    getBucketTargetCount({
      bucketId: `beta`,
      bucketTargets,
    }),
  ).toBe(1);
  expect(
    getSelectedBucketCount({
      bucketId: `alpha`,
      selectedCandidates,
    }),
  ).toBe(1);
  expect(selectedCounts).toEqual([
    {
      bucketId: `alpha`,
      count: 1,
    },
    {
      bucketId: `beta`,
      count: 0,
    },
  ]);
});
