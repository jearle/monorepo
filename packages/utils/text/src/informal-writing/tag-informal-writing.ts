import { tagTextOffensiveness } from '../text-offensiveness';
import { normalizeText, tokenizeText } from '../text-metrics';
import {
  INFORMAL_WRITING_CASUAL_PUNCTUATION_PATTERN,
  INFORMAL_WRITING_CASUAL_TERMS,
  INFORMAL_WRITING_CONTRACTION_PATTERN,
  INFORMAL_WRITING_EMOTICON_PATTERN,
  INFORMAL_WRITING_PLATFORM_CHAT_TERMS,
  INFORMAL_WRITING_REPEATED_LETTERS_PATTERN,
  INFORMAL_WRITING_SIGNAL_CASUAL_PUNCTUATION,
  INFORMAL_WRITING_SIGNAL_CASUAL_WORD,
  INFORMAL_WRITING_SIGNAL_CONTRACTION,
  INFORMAL_WRITING_SIGNAL_EMOTICON,
  INFORMAL_WRITING_SIGNAL_OFFENSIVE_LANGUAGE,
  INFORMAL_WRITING_SIGNAL_PLATFORM_CHAT_TERM,
  INFORMAL_WRITING_SIGNAL_REPEATED_LETTERS,
  INFORMAL_WRITING_SIGNAL_SOCIAL_SLANG,
  INFORMAL_WRITING_SIGNAL_TEXTING_ACRONYM,
  INFORMAL_WRITING_SOCIAL_SLANG_TERMS,
  INFORMAL_WRITING_TEXTING_ACRONYMS,
} from './constants';
import { type InformalWritingSignal, type InformalWritingTag } from './types';
type CheckMatchesTermProps = {
  readonly normalizedText: string;
  readonly term: string;
  readonly tokens: readonly string[];
};

const checkMatchesTerm = (props: CheckMatchesTermProps) => {
  const { normalizedText, term, tokens } = props;
  const isPhrase = term.includes(` `);

  if (isPhrase) {
    const result = normalizedText.includes(term);
    return result;
  }

  const result = tokens.includes(term);
  return result;
};
type CheckHasTermProps = {
  readonly normalizedText: string;
  readonly terms: readonly string[];
  readonly tokens: readonly string[];
};

const checkHasTerm = (props: CheckHasTermProps) => {
  const { normalizedText, terms, tokens } = props;
  const result = terms.some((term) =>
    checkMatchesTerm({
      normalizedText,
      term,
      tokens,
    }),
  );

  return result;
};

const createUniqueValues = <TValue>(values: readonly TValue[]) => {
  const result = Array.from(new Set(values));

  return result;
};

const checkHasRepeatedLetters = (text: string) => {
  const result = INFORMAL_WRITING_REPEATED_LETTERS_PATTERN.test(text);

  return result;
};

const checkHasCasualPunctuation = (text: string) => {
  const result = INFORMAL_WRITING_CASUAL_PUNCTUATION_PATTERN.test(text);

  return result;
};

const checkHasEmoticon = (text: string) => {
  const result = INFORMAL_WRITING_EMOTICON_PATTERN.test(text);

  return result;
};

export type TagInformalWritingProps = {
  readonly text: string;
};

export const tagInformalWriting = (props: TagInformalWritingProps) => {
  const { text } = props;
  const normalizedText = normalizeText({ text }).toLocaleLowerCase(`en-US`);
  const tokens = tokenizeText({ text });
  const offensiveness = tagTextOffensiveness({ text });
  const hasContraction = INFORMAL_WRITING_CONTRACTION_PATTERN.test(text);
  const hasCasualWord = checkHasTerm({
    normalizedText,
    terms: INFORMAL_WRITING_CASUAL_TERMS,
    tokens,
  });
  const hasTextingAcronym = checkHasTerm({
    normalizedText,
    terms: INFORMAL_WRITING_TEXTING_ACRONYMS,
    tokens,
  });
  const hasSocialSlang = checkHasTerm({
    normalizedText,
    terms: INFORMAL_WRITING_SOCIAL_SLANG_TERMS,
    tokens,
  });
  const hasPlatformChatTerm = checkHasTerm({
    normalizedText,
    terms: INFORMAL_WRITING_PLATFORM_CHAT_TERMS,
    tokens,
  });
  const hasRepeatedLetters = checkHasRepeatedLetters(text);
  const hasCasualPunctuation = checkHasCasualPunctuation(text);
  const hasEmoticon = checkHasEmoticon(text);
  const hasOffensiveLanguage = offensiveness.hasOffensiveLanguage;
  const signalChecks = [
    {
      signal: INFORMAL_WRITING_SIGNAL_CONTRACTION,
      isPresent: hasContraction,
    },
    {
      signal: INFORMAL_WRITING_SIGNAL_CASUAL_WORD,
      isPresent: hasCasualWord,
    },
    {
      signal: INFORMAL_WRITING_SIGNAL_TEXTING_ACRONYM,
      isPresent: hasTextingAcronym,
    },
    {
      signal: INFORMAL_WRITING_SIGNAL_SOCIAL_SLANG,
      isPresent: hasSocialSlang,
    },
    {
      signal: INFORMAL_WRITING_SIGNAL_PLATFORM_CHAT_TERM,
      isPresent: hasPlatformChatTerm,
    },
    {
      signal: INFORMAL_WRITING_SIGNAL_REPEATED_LETTERS,
      isPresent: hasRepeatedLetters,
    },
    {
      signal: INFORMAL_WRITING_SIGNAL_CASUAL_PUNCTUATION,
      isPresent: hasCasualPunctuation,
    },
    {
      signal: INFORMAL_WRITING_SIGNAL_EMOTICON,
      isPresent: hasEmoticon,
    },
    {
      signal: INFORMAL_WRITING_SIGNAL_OFFENSIVE_LANGUAGE,
      isPresent: hasOffensiveLanguage,
    },
  ] as const;
  const signals = createUniqueValues<InformalWritingSignal>(
    signalChecks
      .filter((signalCheck) => signalCheck.isPresent)
      .map((signalCheck) => signalCheck.signal),
  );
  const isInformal = signals.length > 0;
  const tag: InformalWritingTag = {
    isInformal,
    offensiveness,
    signals,
  };
  const result = tag;

  return result;
};
