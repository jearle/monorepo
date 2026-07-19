export type CountTextCharactersProps = {
  readonly text: string;
};

export const countTextCharacters = (props: CountTextCharactersProps) => {
  const { text } = props;
  const characters = Array.from(text);
  const result = characters.length;

  return result;
};
