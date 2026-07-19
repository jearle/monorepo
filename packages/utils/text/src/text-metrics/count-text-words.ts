import { tokenizeText } from './tokenize-text';

export type CountTextWordsProps = {
  readonly text: string;
};

export const countTextWords = (props: CountTextWordsProps) => {
  const { text } = props;
  const tokens = tokenizeText({ text });
  const result = tokens.length;

  return result;
};
