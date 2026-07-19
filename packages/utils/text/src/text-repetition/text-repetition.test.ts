import { expect, test } from 'bun:test';

import {
  createTextNgrams,
  findRepeatedTextValues,
  getTextLines,
  getTextSentences,
} from '.';

test(`text repetition helpers find repeated normalized lines and sentences`, () => {
  expect(
    getTextLines({ text: ` first line \n\n first line \n second line ` }),
  ).toEqual([`first line`, `first line`, `second line`]);
  expect(
    getTextSentences({
      text: `First sentence. Second sentence? First sentence.`,
    }),
  ).toEqual([`First sentence.`, `Second sentence?`, `First sentence.`]);
  expect(
    findRepeatedTextValues({
      minOccurrences: 2,
      values: [`a`, `b`, `a`, `c`, `b`, `a`],
    }),
  ).toEqual([
    { count: 3, value: `a` },
    { count: 2, value: `b` },
  ]);
});

test(`createTextNgrams returns deterministic token n-grams`, () => {
  const result = createTextNgrams({
    ngramSize: 3,
    text: `Alpha beta gamma beta gamma delta.`,
  });

  expect(result).toEqual([
    `alpha beta gamma`,
    `beta gamma beta`,
    `gamma beta gamma`,
    `beta gamma delta`,
  ]);
});
