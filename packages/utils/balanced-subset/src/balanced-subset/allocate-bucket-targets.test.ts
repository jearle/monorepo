import { expect, test } from 'bun:test';

import { allocateBucketTargets } from '.';

test(`allocates weighted bucket targets with deterministic remainders`, () => {
  const result = allocateBucketTargets({
    buckets: [
      {
        id: `tertiary`,
        weight: 0,
      },
      {
        id: `primary`,
        weight: 3,
      },
      {
        id: `secondary`,
        weight: 1,
      },
    ],
    targetCount: 8,
  });

  expect(result).toEqual([
    {
      bucketId: `primary`,
      targetCount: 6,
      weight: 3,
    },
    {
      bucketId: `secondary`,
      targetCount: 2,
      weight: 1,
    },
    {
      bucketId: `tertiary`,
      targetCount: 0,
      weight: 0,
    },
  ]);
});

test(`preserves explicit bucket target counts when provided`, () => {
  const result = allocateBucketTargets({
    buckets: [
      {
        id: `unsafe`,
        targetCount: 8,
        weight: 1,
      },
      {
        id: `safe`,
        targetCount: 2,
        weight: 1,
      },
    ],
    targetCount: 10,
  });

  expect(result).toEqual([
    {
      bucketId: `safe`,
      targetCount: 2,
      weight: 1,
    },
    {
      bucketId: `unsafe`,
      targetCount: 8,
      weight: 1,
    },
  ]);
});
