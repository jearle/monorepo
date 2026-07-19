import { SENTENCE_TERMINATOR_PATTERN, normalizeText } from '../text-metrics';

const checkHasWordCharacter = (value: string) => {
  const result = /[\p{L}\p{N}]/u.test(value);
  return result;
};

export type GetTextSentencesProps = {
  readonly text: string;
};

export const getTextSentences = (props: GetTextSentencesProps) => {
  const { text } = props;
  const normalizedText = normalizeText({ text });
  const hasSentenceTerminator =
    SENTENCE_TERMINATOR_PATTERN.test(normalizedText);

  if (normalizedText.length === 0) {
    const result: readonly string[] = [];
    return result;
  }

  if (hasSentenceTerminator === false) {
    const result = checkHasWordCharacter(normalizedText)
      ? [normalizedText]
      : [];
    return result;
  }

  const matches = normalizedText.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) ?? [];
  const result = matches
    .map((sentence) => {
      return normalizeText({ text: sentence });
    })
    .filter(checkHasWordCharacter);

  return result;
};
