import { expect, test } from 'bun:test';

import {
  INFORMAL_WRITING_SIGNAL_CASUAL_PUNCTUATION,
  INFORMAL_WRITING_SIGNAL_CASUAL_WORD,
  INFORMAL_WRITING_SIGNAL_CONTRACTION,
  INFORMAL_WRITING_SIGNAL_OFFENSIVE_LANGUAGE,
  INFORMAL_WRITING_SIGNAL_PLATFORM_CHAT_TERM,
  INFORMAL_WRITING_SIGNAL_SOCIAL_SLANG,
  INFORMAL_WRITING_SIGNAL_TEXTING_ACRONYM,
  tagInformalWriting,
} from '.';

test(`tags informal writing from casual words and acronyms`, () => {
  const result = tagInformalWriting({
    text: `hey can u help? I don't get this lol`,
  });

  expect(result.isInformal).toBe(true);
  expect(result.signals).toContain(INFORMAL_WRITING_SIGNAL_CASUAL_WORD);
  expect(result.signals).toContain(INFORMAL_WRITING_SIGNAL_CONTRACTION);
  expect(result.signals).toContain(INFORMAL_WRITING_SIGNAL_TEXTING_ACRONYM);
});

test(`tags contemporary social slang and casual punctuation`, () => {
  const result = tagInformalWriting({
    text: `fr this is no cap amazing!!`,
  });

  expect(result.isInformal).toBe(true);
  expect(result.signals).toContain(INFORMAL_WRITING_SIGNAL_SOCIAL_SLANG);
  expect(result.signals).toContain(INFORMAL_WRITING_SIGNAL_CASUAL_PUNCTUATION);
});

test(`tags expanded informal dictionaries after normalization`, () => {
  const result = tagInformalWriting({
    text: `BESTIE bffr this fanum tax copypasta went viral ONG`,
  });

  expect(result.isInformal).toBe(true);
  expect(result.signals).toContain(INFORMAL_WRITING_SIGNAL_CASUAL_WORD);
  expect(result.signals).toContain(INFORMAL_WRITING_SIGNAL_TEXTING_ACRONYM);
  expect(result.signals).toContain(INFORMAL_WRITING_SIGNAL_SOCIAL_SLANG);
  expect(result.signals).toContain(INFORMAL_WRITING_SIGNAL_PLATFORM_CHAT_TERM);
});

test(`includes offensiveness signals from text-offensiveness`, () => {
  const result = tagInformalWriting({
    text: `KYS is not a useful reply`,
  });

  expect(result.isInformal).toBe(true);
  expect(result.signals).toContain(INFORMAL_WRITING_SIGNAL_OFFENSIVE_LANGUAGE);
  expect(result.offensiveness.hasOffensiveLanguage).toBe(true);
});
