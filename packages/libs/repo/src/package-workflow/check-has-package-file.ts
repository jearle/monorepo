import fs from 'node:fs';
import path from 'node:path';

import { type WorkspacePackage } from '../workspace';

const ignoredDirectoryNames = new Set([
  `.turbo`,
  `build`,
  `coverage`,
  `dist`,
  `node_modules`,
]);

const checkDirectoryHasFile = (
  directoryPath: string,
  checkIsFilename: (filename: string) => boolean,
): boolean => {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const result = entries.some((entry) => {
    if (entry.isDirectory()) {
      const isIgnoredDirectory = ignoredDirectoryNames.has(entry.name);

      if (isIgnoredDirectory) {
        return false;
      }

      const childDirectoryPath = path.join(directoryPath, entry.name);
      const hasChildFile = checkDirectoryHasFile(
        childDirectoryPath,
        checkIsFilename,
      );

      return hasChildFile;
    }

    if (entry.isFile() === false) {
      return false;
    }

    const isFilename = checkIsFilename(entry.name);
    return isFilename;
  });

  return result;
};
export type CheckHasPackageFileProps = {
  readonly checkIsFilename: (filename: string) => boolean;
  readonly packageInfo: WorkspacePackage;
};

export const checkHasPackageFile = (props: CheckHasPackageFileProps) => {
  const { checkIsFilename, packageInfo } = props;
  const hasPackageDirectory = fs.existsSync(packageInfo.directory);

  if (hasPackageDirectory === false) {
    return false;
  }

  const result = checkDirectoryHasFile(packageInfo.directory, checkIsFilename);
  return result;
};
