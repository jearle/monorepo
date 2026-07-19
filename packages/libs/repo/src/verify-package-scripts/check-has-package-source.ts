import fs from 'node:fs';
import path from 'node:path';

import { type WorkspacePackage } from '../workspace';

export const checkHasPackageSource = (packageInfo: WorkspacePackage) => {
  const sourceDirectoryPath = path.join(packageInfo.directory, `src`);
  const result = fs.existsSync(sourceDirectoryPath);

  return result;
};
