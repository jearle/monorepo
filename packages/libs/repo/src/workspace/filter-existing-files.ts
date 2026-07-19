import fs from 'node:fs';
import path from 'node:path';

export type FilterExistingFilesProps = {
  readonly filePaths: readonly string[];
  readonly repoRoot: string;
};

export const filterExistingFiles = (props: FilterExistingFilesProps) => {
  const { filePaths, repoRoot } = props;
  const result = filePaths.filter((filePath) => {
    const absoluteFilePath = path.join(repoRoot, filePath);
    const fileExists = fs.existsSync(absoluteFilePath);

    return fileExists;
  });

  return result;
};
