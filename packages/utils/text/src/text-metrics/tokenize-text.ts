import { WORD_TOKEN_PATTERN } from './constants';
import { normalizeText } from './normalize-text';

export type TokenizeTextProps = {
  readonly text: string;
};

export const tokenizeText = (props: TokenizeTextProps) => {
  const { text } = props;
  const normalizedText = normalizeText({ text });
  const matches = normalizedText.match(WORD_TOKEN_PATTERN) ?? [];
  const result = matches.map((match) => match.toLocaleLowerCase(`en-US`));

  return result;
};
