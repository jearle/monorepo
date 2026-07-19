import { tokenizeText } from '../text-metrics';

export type CreateTextNgramsProps = {
  readonly ngramSize: number;
  readonly text: string;
};

export const createTextNgrams = (
  props: CreateTextNgramsProps,
): readonly string[] => {
  const { ngramSize, text } = props;
  const tokens = tokenizeText({ text });

  if (ngramSize <= 0 || tokens.length < ngramSize) {
    const result: readonly string[] = [];
    return result;
  }

  const result = tokens.flatMap((_, index) => {
    const values = tokens.slice(index, index + ngramSize);

    if (values.length !== ngramSize) {
      const result: readonly string[] = [];
      return result;
    }

    const result: readonly string[] = [values.join(` `)];
    return result;
  });

  return result;
};
