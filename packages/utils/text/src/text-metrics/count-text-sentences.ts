import { SENTENCE_TERMINATOR_PATTERN } from './constants';
import { normalizeText } from './normalize-text';

const checkHasWordCharacter = (value: string) => {
  const result = /[\p{L}\p{N}]/u.test(value);

  return result;
};
export type CountTextSentencesProps = {
  readonly text: string;
};

export const countTextSentences = (props: CountTextSentencesProps) => {
  const { text } = props;
  const normalizedText = normalizeText({ text });
  const hasText = normalizedText.length > 0;

  if (hasText === false) {
    return 0;
  }

  const sentenceParts = normalizedText
    .split(SENTENCE_TERMINATOR_PATTERN)
    .filter(checkHasWordCharacter);
  const hasSentenceTerminator =
    SENTENCE_TERMINATOR_PATTERN.test(normalizedText);
  const result = hasSentenceTerminator ? sentenceParts.length : 1;

  return result;
};
