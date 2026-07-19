import fs from 'node:fs';
import path from 'node:path';

import { type WorkspacePackage } from '../workspace';
import { IGNORED_PACKAGE_FILE_DIRECTORY_NAMES } from './constants';

const checkDirectoryHasFile = (
  directoryPath: string,
  checkIsFilename: (filename: string) => boolean,
): boolean => {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const result = entries.some((entry) => {
    if (entry.isDirectory()) {
      const isIgnoredDirectory = IGNORED_PACKAGE_FILE_DIRECTORY_NAMES.has(
        entry.name,
      );

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

    return checkIsFilename(entry.name);
  });

  return result;
};

export const checkHasPackageFile = (
  packageInfo: WorkspacePackage,
  checkIsFilename: (filename: string) => boolean,
) => {
  const result = checkDirectoryHasFile(packageInfo.directory, checkIsFilename);

  return result;
};
