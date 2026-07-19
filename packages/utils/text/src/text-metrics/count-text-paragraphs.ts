import { normalizeText } from './normalize-text';

export type CountTextParagraphsProps = {
  readonly text: string;
};

export const countTextParagraphs = (props: CountTextParagraphsProps) => {
  const { text } = props;
  const normalizedText = normalizeText({ text });
  const hasText = normalizedText.length > 0;

  if (hasText === false) {
    return 0;
  }

  const paragraphs = normalizedText
    .split(/\n\s*\n/u)
    .filter((paragraph) => paragraph.trim().length > 0);
  const result = paragraphs.length;

  return result;
};
