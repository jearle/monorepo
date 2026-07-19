import { expect, test } from 'bun:test';

import {
  compareFrequencyTableEntries,
  createFrequencyTable,
  getNormalizedEntropy,
  getTopCumulativeShare,
  getTopFrequencies,
  normalizeFrequencyLimit,
  summarizeFrequencyDistribution,
} from '.';

test(`returns an empty frequency table for empty input`, () => {
  const result = createFrequencyTable({ values: [] });

  expect(result).toEqual([]);
});

test(`returns zero entropy and full share for a single repeated value`, () => {
  const values = [`alpha`, `alpha`, `alpha`];
  const frequencyTable = createFrequencyTable({ values });
  const normalizedEntropy = getNormalizedEntropy({ values });
  const topCumulativeShare = getTopCumulativeShare({
    limit: 1,
    values,
  });

  expect(frequencyTable).toEqual([
    {
      count: 3,
      share: 1,
      value: `alpha`,
    },
  ]);
  expect(normalizedEntropy).toBe(0);
  expect(topCumulativeShare).toBe(1);
});

test(`returns maximum normalized entropy for all-unique values`, () => {
  const values = [`gamma`, `alpha`, `beta`];
  const frequencyTable = createFrequencyTable({ values });
  const normalizedEntropy = getNormalizedEntropy({ values });

  expect(frequencyTable).toEqual([
    {
      count: 1,
      share: 0.333333,
      value: `alpha`,
    },
    {
      count: 1,
      share: 0.333333,
      value: `beta`,
    },
    {
      count: 1,
      share: 0.333333,
      value: `gamma`,
    },
  ]);
  expect(normalizedEntropy).toBe(1);
});

test(`orders frequencies by count descending and value ascending`, () => {
  const values = [`gamma`, `beta`, `alpha`, `delta`, `gamma`, `alpha`, `beta`];
  const frequencyTable = createFrequencyTable({ values });

  expect(frequencyTable).toEqual([
    {
      count: 2,
      share: 0.285714,
      value: `alpha`,
    },
    {
      count: 2,
      share: 0.285714,
      value: `beta`,
    },
    {
      count: 2,
      share: 0.285714,
      value: `gamma`,
    },
    {
      count: 1,
      share: 0.142857,
      value: `delta`,
    },
  ]);
});

test(`returns top frequencies using deterministic tie ordering`, () => {
  const values = [`gamma`, `beta`, `alpha`, `delta`, `gamma`, `alpha`, `beta`];
  const result = getTopFrequencies({
    limit: 2,
    values,
  });

  expect(result).toEqual([
    {
      count: 2,
      share: 0.285714,
      value: `alpha`,
    },
    {
      count: 2,
      share: 0.285714,
      value: `beta`,
    },
  ]);
});

test(`compares frequency table entries by count and value`, () => {
  const alphaEntry = {
    count: 2,
    share: 0.5,
    value: `alpha`,
  };
  const betaEntry = {
    count: 2,
    share: 0.5,
    value: `beta`,
  };
  const gammaEntry = {
    count: 3,
    share: 0.75,
    value: `gamma`,
  };

  expect(
    compareFrequencyTableEntries({
      entry1: gammaEntry,
      entry2: alphaEntry,
    }),
  ).toBeLessThan(0);
  expect(
    compareFrequencyTableEntries({
      entry1: betaEntry,
      entry2: alphaEntry,
    }),
  ).toBeGreaterThan(0);
});

test(`normalizes frequency limits deterministically`, () => {
  expect(normalizeFrequencyLimit({ limit: 2.9 })).toBe(2);
  expect(normalizeFrequencyLimit({ limit: -1 })).toBe(0);
  expect(normalizeFrequencyLimit({ limit: Number.NaN })).toBe(0);
});

test(`computes top cumulative share from top counts`, () => {
  const result = getTopCumulativeShare({
    limit: 2,
    values: [`alpha`, `alpha`, `beta`, `gamma`],
  });

  expect(result).toBe(0.75);
});

test(`rounds shares and entropy with the requested precision`, () => {
  const values = [`alpha`, `alpha`, `alpha`, `beta`];
  const frequencyTable = createFrequencyTable({
    precision: 3,
    values,
  });
  const topCumulativeShare = getTopCumulativeShare({
    limit: 1,
    precision: 3,
    values,
  });
  const normalizedEntropy = getNormalizedEntropy({
    precision: 3,
    values,
  });

  expect(frequencyTable).toEqual([
    {
      count: 3,
      share: 0.75,
      value: `alpha`,
    },
    {
      count: 1,
      share: 0.25,
      value: `beta`,
    },
  ]);
  expect(topCumulativeShare).toBe(0.75);
  expect(normalizedEntropy).toBe(0.811);
});

test(`summarizes frequency distributions deterministically`, () => {
  const values = [`gamma`, `beta`, `alpha`, `delta`, `gamma`, `alpha`, `beta`];
  const result = summarizeFrequencyDistribution({
    precision: 3,
    topLimit: 2,
    values,
  });

  expect(result).toEqual({
    frequencyTable: [
      {
        count: 2,
        share: 0.286,
        value: `alpha`,
      },
      {
        count: 2,
        share: 0.286,
        value: `beta`,
      },
      {
        count: 2,
        share: 0.286,
        value: `gamma`,
      },
      {
        count: 1,
        share: 0.143,
        value: `delta`,
      },
    ],
    normalizedEntropy: 0.975,
    topCumulativeShare: 0.571,
    topFrequencies: [
      {
        count: 2,
        share: 0.286,
        value: `alpha`,
      },
      {
        count: 2,
        share: 0.286,
        value: `beta`,
      },
    ],
    totalCount: 7,
    uniqueValueCount: 4,
  });
});
