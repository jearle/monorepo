import Papa, { type UnparseConfig, type UnparseObject } from 'papaparse';

import { type CSVExportInput } from './types';

export type ToCSVProps = {
  readonly config?: UnparseConfig;
  readonly json: CSVExportInput;
};

export const toCSV = (props: ToCSVProps) => {
  const { config = {}, json } = props;
  const csvInput = json as unknown[] | UnparseObject<unknown>;
  const csv = Papa.unparse(csvInput, config);
  const result = { csv };

  return result;
};
