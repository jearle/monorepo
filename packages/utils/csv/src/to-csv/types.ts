export type CSVCell = boolean | null | number | string;

export type CSVRecord = Readonly<Record<string, CSVCell>>;

export type CSVRow = readonly CSVCell[] | CSVRecord;

export type CSVExportObject = {
  readonly data: readonly CSVRow[];
  readonly fields: readonly string[];
};

export type CSVExportInput = readonly CSVRow[] | CSVExportObject;
