import { cuss } from 'cuss';

import { normalizeText, tokenizeText } from '../text-metrics';
import {
  TEXT_OFFENSIVENESS_OBFUSCATED_PROFANITY_PATTERNS,
  TEXT_OFFENSIVENESS_SIGNAL_CUSS_TERM,
  TEXT_OFFENSIVENESS_SIGNAL_OBFUSCATED_PROFANITY,
  TEXT_OFFENSIVENESS_SUPPLEMENTAL_TERMS,
} from './constants';
import {
  type TextOffensivenessSignal,
  type TextOffensivenessTag,
} from './types';

const checkIsCussToken = (token: string) => {
  const rating = cuss[token];
  const result = rating !== undefined && rating > 0;

  return result;
};
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

const checkHasObfuscatedProfanity = (normalizedText: string) => {
  const result = TEXT_OFFENSIVENESS_OBFUSCATED_PROFANITY_PATTERNS.some(
    (pattern) => pattern.test(normalizedText),
  );

  return result;
};

const createUniqueValues = <TValue>(values: readonly TValue[]) => {
  const result = Array.from(new Set(values));

  return result;
};

export type TagTextOffensivenessProps = {
  readonly text: string;
};

export const tagTextOffensiveness = (props: TagTextOffensivenessProps) => {
  const { text } = props;
  const normalizedText = normalizeText({ text }).toLocaleLowerCase(`en-US`);
  const tokens = tokenizeText({ text });
  const cussTerms = createUniqueValues(tokens.filter(checkIsCussToken));
  const supplementalTerms = TEXT_OFFENSIVENESS_SUPPLEMENTAL_TERMS.filter(
    (termConfig) => {
      const matchesTerm = checkMatchesTerm({
        normalizedText,
        term: termConfig.term,
        tokens,
      });

      return matchesTerm;
    },
  );
  const hasObfuscatedProfanity = checkHasObfuscatedProfanity(normalizedText);
  const cussSignals =
    cussTerms.length > 0
      ? ([TEXT_OFFENSIVENESS_SIGNAL_CUSS_TERM] as const)
      : [];
  const supplementalSignals = supplementalTerms.map((termConfig) => {
    const result = termConfig.signal;
    return result;
  });
  const obfuscatedProfanitySignals = hasObfuscatedProfanity
    ? ([TEXT_OFFENSIVENESS_SIGNAL_OBFUSCATED_PROFANITY] as const)
    : [];
  const signals = createUniqueValues<TextOffensivenessSignal>([
    ...cussSignals,
    ...supplementalSignals,
    ...obfuscatedProfanitySignals,
  ]);
  const supplementalMatchedTerms = supplementalTerms.map((termConfig) => {
    const result = termConfig.term;
    return result;
  });
  const obfuscatedMatchedTerms = hasObfuscatedProfanity
    ? ([`obfuscated-profanity-pattern`] as const)
    : [];
  const matchedTerms = createUniqueValues([
    ...cussTerms,
    ...supplementalMatchedTerms,
    ...obfuscatedMatchedTerms,
  ]);
  const tag: TextOffensivenessTag = {
    cussTermCount: cussTerms.length,
    hasOffensiveLanguage: signals.length > 0,
    matchedTerms,
    signals,
    supplementalTermCount:
      supplementalMatchedTerms.length + obfuscatedMatchedTerms.length,
  };
  const result = tag;

  return result;
};
