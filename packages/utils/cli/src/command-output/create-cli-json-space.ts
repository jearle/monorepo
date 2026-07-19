export type CreateCLIJSONSpaceProps = {
  readonly spaceSize: number;
};

export const createCLIJSONSpace = (props: CreateCLIJSONSpaceProps) => {
  const { spaceSize } = props;
  const space = ` `.repeat(spaceSize);

  return space;
};
