import { type CSVRow } from '../to-csv';
import { checkIsCSVCell } from './check-is-csv-cell';
import { checkIsCSVRecord } from './check-is-csv-record';

export const checkIsCSVRow = (value: unknown): value is CSVRow => {
  if (Array.isArray(value)) {
    const result = value.every((item) => checkIsCSVCell(item));

    return result;
  }

  const result = checkIsCSVRecord(value);

  return result;
};
