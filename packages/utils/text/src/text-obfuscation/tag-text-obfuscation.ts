import { tokenizeText } from '../text-metrics';
import {
  LEETSPEAK_DIGIT_PATTERN,
  LEETSPEAK_LETTER_PATTERN,
  OBFUSCATION_SIGNAL_LEETSPEAK,
  OBFUSCATION_SIGNAL_SPACED_WORD,
  OBFUSCATION_SIGNAL_SYMBOL_SUBSTITUTION,
  OBFUSCATION_SIGNAL_ZERO_WIDTH,
  SPACED_WORD_PATTERN,
  SYMBOL_SUBSTITUTION_PATTERN,
  ZERO_WIDTH_PATTERN,
} from './constants';
import { type TextObfuscationTag } from './types';

const checkHasLeetspeak = (text: string) => {
  const tokens = tokenizeText({ text });
  const result = tokens.some((token) => {
    const hasLetter = LEETSPEAK_LETTER_PATTERN.test(token);
    const hasDigit = LEETSPEAK_DIGIT_PATTERN.test(token);
    const isLeetspeak = hasLetter && hasDigit;

    return isLeetspeak;
  });

  return result;
};

const checkHasSymbolSubstitution = (text: string) => {
  const result = SYMBOL_SUBSTITUTION_PATTERN.test(text);

  return result;
};

const checkHasSpacedWord = (text: string) => {
  const result = SPACED_WORD_PATTERN.test(text);

  return result;
};

const checkHasZeroWidth = (text: string) => {
  const result = ZERO_WIDTH_PATTERN.test(text);

  return result;
};

export type TagTextObfuscationProps = {
  readonly text: string;
};

export const tagTextObfuscation = (props: TagTextObfuscationProps) => {
  const { text } = props;
  const hasLeetspeak = checkHasLeetspeak(text);
  const hasSymbolSubstitution = checkHasSymbolSubstitution(text);
  const hasSpacedWord = checkHasSpacedWord(text);
  const hasZeroWidth = checkHasZeroWidth(text);
  const signalChecks = [
    {
      signal: OBFUSCATION_SIGNAL_LEETSPEAK,
      isPresent: hasLeetspeak,
    },
    {
      signal: OBFUSCATION_SIGNAL_SYMBOL_SUBSTITUTION,
      isPresent: hasSymbolSubstitution,
    },
    {
      signal: OBFUSCATION_SIGNAL_SPACED_WORD,
      isPresent: hasSpacedWord,
    },
    {
      signal: OBFUSCATION_SIGNAL_ZERO_WIDTH,
      isPresent: hasZeroWidth,
    },
  ] as const;
  const signals = signalChecks
    .filter((signalCheck) => signalCheck.isPresent)
    .map((signalCheck) => signalCheck.signal);
  const tag: TextObfuscationTag = {
    hasObfuscation: signals.length > 0,
    signals,
  };
  const result = tag;

  return result;
};
