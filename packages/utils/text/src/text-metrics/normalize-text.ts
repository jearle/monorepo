export type NormalizeTextProps = {
  readonly text: string;
};

export const normalizeText = (props: NormalizeTextProps) => {
  const { text } = props;
  const normalizedLineEndings = text.replace(/\r\n?/gu, `\n`);
  const normalizedSpaces = normalizedLineEndings.replace(/[^\S\n]+/gu, ` `);
  const normalizedLinePadding = normalizedSpaces.replace(/ *\n */gu, `\n`);
  const result = normalizedLinePadding.trim();

  return result;
};
