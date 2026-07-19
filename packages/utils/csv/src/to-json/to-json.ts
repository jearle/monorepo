import Papa from 'papaparse';

import { type ToJSONOptions } from './types';

export const toJSON = (csv: string, options: ToJSONOptions = {}) => {
  const { data: json, errors, meta } = Papa.parse(csv, options);

  const result = { errors, json, meta };

  return result;
};
