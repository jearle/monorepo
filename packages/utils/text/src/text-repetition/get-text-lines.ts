import { normalizeText } from '../text-metrics';

export type GetTextLinesProps = {
  readonly text: string;
};

export const getTextLines = (props: GetTextLinesProps) => {
  const { text } = props;
  const normalizedText = normalizeText({ text });
  const result = normalizedText.split(`\n`).filter((line) => {
    return line.length > 0;
  });

  return result;
};
