import Papa, { type ParseConfig } from 'papaparse';

type toJSONProps = {
  readonly csv: string;
  readonly config?: ParseConfig;
};
export const toJSON = (props: toJSONProps) => {
  const { csv, config = {} } = props;

  const { data: json } = Papa.parse(csv, config);

  const result = { json };

  return result;
};
