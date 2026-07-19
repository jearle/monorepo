import { type CSVCell } from '../to-csv';

export const checkIsCSVCell = (value: unknown): value is CSVCell => {
  const result =
    value === null ||
    typeof value === `string` ||
    typeof value === `number` ||
    typeof value === `boolean`;

  return result;
};
