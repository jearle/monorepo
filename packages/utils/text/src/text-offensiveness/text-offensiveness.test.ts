import { expect, test } from 'bun:test';

import {
  TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
  TEXT_OFFENSIVENESS_SIGNAL_CUSS_TERM,
  TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT,
  TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM,
  TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR,
  TEXT_OFFENSIVENESS_SIGNAL_OBFUSCATED_PROFANITY,
  TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
  tagTextOffensiveness,
} from '.';

test(`tags cuss terms as base offensive language`, () => {
  const result = tagTextOffensiveness({
    text: `This is fucking broken.`,
  });

  expect(result.hasOffensiveLanguage).toBe(true);
  expect(result.cussTermCount).toBe(1);
  expect(result.signals).toContain(TEXT_OFFENSIVENESS_SIGNAL_CUSS_TERM);
  expect(result.matchedTerms).toContain(`fucking`);
});

test(`tags Monorepo supplemental harassment terms after normalization`, () => {
  const result = tagTextOffensiveness({
    text: `KYS is not acceptable feedback.`,
  });

  expect(result.hasOffensiveLanguage).toBe(true);
  expect(result.signals).toContain(TEXT_OFFENSIVENESS_SIGNAL_HARASSMENT_INSULT);
  expect(result.matchedTerms).toContain(`kys`);
});

test(`tags supplemental algo-speak euphemisms`, () => {
  const result = tagTextOffensiveness({
    text: `That pdf file joke does not belong here.`,
  });

  expect(result.hasOffensiveLanguage).toBe(true);
  expect(result.signals).toContain(
    TEXT_OFFENSIVENESS_SIGNAL_ALGO_SPEAK_EUPHEMISM,
  );
  expect(result.matchedTerms).toContain(`pdf file`);
});

test(`tags expanded supplemental offensive categories`, () => {
  const result = tagTextOffensiveness({
    text: `That 1488 line and troon insult should be removed, stfu.`,
  });

  expect(result.hasOffensiveLanguage).toBe(true);
  expect(result.signals).toContain(TEXT_OFFENSIVENESS_SIGNAL_HATE_CODED_TERM);
  expect(result.signals).toContain(TEXT_OFFENSIVENESS_SIGNAL_IDENTITY_SLUR);
  expect(result.signals).toContain(
    TEXT_OFFENSIVENESS_SIGNAL_SUPPLEMENTAL_PROFANITY,
  );
  expect(result.matchedTerms).toContain(`1488`);
  expect(result.matchedTerms).toContain(`troon`);
  expect(result.matchedTerms).toContain(`stfu`);
});

test(`tags obfuscated profanity patterns`, () => {
  const result = tagTextOffensiveness({
    text: `f*ck this`,
  });

  expect(result.hasOffensiveLanguage).toBe(true);
  expect(result.signals).toContain(
    TEXT_OFFENSIVENESS_SIGNAL_OBFUSCATED_PROFANITY,
  );
});

test(`tags expanded obfuscated profanity patterns`, () => {
  const result = tagTextOffensiveness({
    text: `d!ck move`,
  });

  expect(result.hasOffensiveLanguage).toBe(true);
  expect(result.signals).toContain(
    TEXT_OFFENSIVENESS_SIGNAL_OBFUSCATED_PROFANITY,
  );
});

test(`does not tag neutral text`, () => {
  const result = tagTextOffensiveness({
    text: `Please review this normal request.`,
  });

  expect(result.hasOffensiveLanguage).toBe(false);
  expect(result.signals).toEqual([]);
  expect(result.matchedTerms).toEqual([]);
});
