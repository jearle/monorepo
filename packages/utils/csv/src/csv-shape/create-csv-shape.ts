type CSVShape = {
  readonly columnCount: number;
  readonly columns?: readonly string[];
  readonly rowCount: number;
};

const checkIsRecord = (value: unknown): value is Record<string, unknown> => {
  const result =
    value !== null &&
    typeof value === `object` &&
    Array.isArray(value) === false;

  return result;
};

const getRowColumnCount = (row: unknown) => {
  if (Array.isArray(row)) {
    return row.length;
  }

  if (checkIsRecord(row)) {
    return Object.keys(row).length;
  }

  return 0;
};

export type CreateCSVShapeProps = {
  readonly columns?: readonly string[];
  readonly rows: readonly unknown[];
};

export const createCSVShape = (props: CreateCSVShapeProps) => {
  const { columns, rows } = props;
  const columnCounts = rows.map((row) => getRowColumnCount(row));
  const fallbackColumnCount = Math.max(0, ...columnCounts);
  const columnCount =
    columns === undefined ? fallbackColumnCount : columns.length;
  const shape: CSVShape = {
    columnCount,
    columns,
    rowCount: rows.length,
  };

  return shape;
};
