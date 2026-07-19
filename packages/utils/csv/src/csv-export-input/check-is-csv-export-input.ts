import { type CSVExportInput } from '../to-csv';
import { checkIsCSVRows } from './check-is-csv-rows';
import { checkIsPlainRecord } from './check-is-plain-record';

export const checkIsCSVExportInput = (
  value: unknown,
): value is CSVExportInput => {
  const isCSVRows = checkIsCSVRows(value);

  if (isCSVRows) {
    return true;
  }

  const isPlainRecord = checkIsPlainRecord(value);

  if (isPlainRecord === false) {
    return false;
  }

  const data = value[`data`];
  const fields = value[`fields`];
  const hasFields =
    Array.isArray(fields) && fields.every((field) => typeof field === `string`);
  const hasData = checkIsCSVRows(data);
  const result = hasFields && hasData;

  return result;
};
