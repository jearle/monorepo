import { type CSVRecord } from '../to-csv';
import { checkIsCSVCell } from './check-is-csv-cell';
import { checkIsPlainRecord } from './check-is-plain-record';

export const checkIsCSVRecord = (value: unknown): value is CSVRecord => {
  const isPlainRecord = checkIsPlainRecord(value);

  if (isPlainRecord === false) {
    return false;
  }

  const result = Object.values(value).every((item) => checkIsCSVCell(item));

  return result;
};
