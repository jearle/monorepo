import { type CSVRow } from '../to-csv';
import { checkIsCSVRecord } from './check-is-csv-record';
import { checkIsCSVRow } from './check-is-csv-row';

const checkHasConsistentRowShape = (rows: readonly unknown[]) => {
  const [firstRow] = rows;

  if (firstRow === undefined) {
    return true;
  }

  const isFirstRowArray = Array.isArray(firstRow);

  if (isFirstRowArray) {
    const result = rows.every((row) => {
      const isRowArray = Array.isArray(row);

      if (isRowArray === false) {
        return false;
      }

      const isCSVRow = checkIsCSVRow(row);

      return isCSVRow;
    });

    return result;
  }

  const isFirstRowCSVRecord = checkIsCSVRecord(firstRow);

  if (isFirstRowCSVRecord) {
    const result = rows.every((row) => {
      const isCSVRecord = checkIsCSVRecord(row);

      return isCSVRecord;
    });

    return result;
  }

  return false;
};

export const checkIsCSVRows = (value: unknown): value is readonly CSVRow[] => {
  const isArray = Array.isArray(value);

  if (isArray === false) {
    return false;
  }

  const result = checkHasConsistentRowShape(value);

  return result;
};
