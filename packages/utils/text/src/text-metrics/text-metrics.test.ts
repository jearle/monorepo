import { expect, test } from 'bun:test';

import {
  countTextCharacters,
  countTextParagraphs,
  countTextSentences,
  countTextWords,
  normalizeText,
  tokenizeText,
} from '.';

test(`normalizes whitespace and line endings deterministically`, () => {
  const result = normalizeText({
    text: `  first\tline\r\n\r\n second   line  `,
  });

  expect(result).toBe(`first line\n\nsecond line`);
});

test(`tokenizes empty, whitespace, and punctuation-only text`, () => {
  expect(tokenizeText({ text: `` })).toEqual([]);
  expect(tokenizeText({ text: ` \n\t ` })).toEqual([]);
  expect(tokenizeText({ text: `?!.,;` })).toEqual([]);
});

test(`tokenizes words, contractions, hyphenated words, and obfuscated tokens`, () => {
  const result = tokenizeText({
    text: `Don't re-run p@ssw0rd checks.`,
  });

  expect(result).toEqual([`don't`, `re-run`, `p`, `ssw0rd`, `checks`]);
});

test(`counts characters, words, sentences, and paragraphs`, () => {
  const text = `First sentence. Second one?\n\nThird paragraph!`;

  expect(countTextCharacters({ text })).toBe(45);
  expect(countTextWords({ text })).toBe(6);
  expect(countTextSentences({ text })).toBe(3);
  expect(countTextParagraphs({ text })).toBe(2);
});

test(`counts text without sentence terminators as one sentence`, () => {
  const result = countTextSentences({ text: `single sentence without marker` });

  expect(result).toBe(1);
});

test(`counts punctuation-only text as zero sentences`, () => {
  const result = countTextSentences({ text: `?!...` });

  expect(result).toBe(0);
});

test(`counts empty paragraph segments and line breaks predictably`, () => {
  const text = `\n\nFirst paragraph wraps\nwithout a blank line.\n\n\nSecond paragraph.`;

  expect(countTextParagraphs({ text })).toBe(2);
  expect(countTextSentences({ text })).toBe(2);
});
