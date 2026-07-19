import { expect, test } from 'bun:test';

import {
  checkIsEligibleCandidate,
  compareBalancedSubsetCandidates,
  selectNextCandidate,
} from '.';

test(`breaks candidate ties by coverage gap, score, and candidate id`, () => {
  const candidates = [
    {
      bucketId: `covered`,
      id: `zeta`,
      score: 1,
    },
    {
      bucketId: `gap`,
      id: `beta`,
      score: 0.5,
    },
    {
      bucketId: `gap`,
      id: `alpha`,
      score: 0.5,
    },
  ];
  const coverageGaps = [
    {
      bucketId: `covered`,
      coverageShare: 1,
      gapCount: 0,
      gapScore: 0,
      selectedCount: 1,
      targetCount: 1,
    },
    {
      bucketId: `gap`,
      coverageShare: 0,
      gapCount: 1,
      gapScore: 1,
      selectedCount: 0,
      targetCount: 1,
    },
  ];
  const result = candidates.toSorted((candidate1, candidate2) => {
    return compareBalancedSubsetCandidates({
      candidate1,
      candidate2,
      coverageGaps,
    });
  });

  expect(result.map((candidate) => candidate.id)).toEqual([
    `alpha`,
    `beta`,
    `zeta`,
  ]);
});

test(`checks subset eligibility before ranking candidates`, () => {
  const bucketTargets = [
    {
      bucketId: `alpha`,
      targetCount: 1,
      weight: 1,
    },
    {
      bucketId: `beta`,
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

  expect(
    checkIsEligibleCandidate({
      bucketTargets,
      candidate: {
        bucketId: `beta`,
        id: `beta-1`,
        score: 0.8,
      },
      selectedCandidates,
      selectedIds,
    }),
  ).toBe(true);
  expect(
    checkIsEligibleCandidate({
      bucketTargets,
      candidate: {
        bucketId: `alpha`,
        id: `alpha-2`,
        score: 0.9,
      },
      selectedCandidates,
      selectedIds,
    }),
  ).toBe(false);
  expect(
    checkIsEligibleCandidate({
      bucketTargets,
      candidate: {
        bucketId: `beta`,
        hardRejected: true,
        id: `beta-rejected`,
        score: 1,
      },
      selectedCandidates,
      selectedIds,
    }),
  ).toBe(false);
  expect(
    checkIsEligibleCandidate({
      bucketTargets,
      candidate: selectedCandidate,
      selectedCandidates,
      selectedIds,
    }),
  ).toBe(false);
});

test(`selects the next candidate from the largest coverage gap`, () => {
  const bucketTargets = [
    {
      bucketId: `alpha`,
      targetCount: 1,
      weight: 1,
    },
    {
      bucketId: `beta`,
      targetCount: 1,
      weight: 1,
    },
  ];
  const result = selectNextCandidate({
    bucketTargets,
    candidates: [
      {
        bucketId: `alpha`,
        id: `alpha-2`,
        score: 1,
      },
      {
        bucketId: `beta`,
        id: `beta-1`,
        score: 0.5,
      },
    ],
    selectedCandidates: [
      {
        bucketId: `alpha`,
        id: `alpha-1`,
        score: 0.1,
      },
    ],
  });

  expect(result).toMatchObject({
    bucketId: `beta`,
    id: `beta-1`,
  });
});
