import fs from 'node:fs';
import path from 'node:path';

import { type WorkspacePackage } from '../workspace';

export type CheckHasPackageSourceProps = {
  readonly packageInfo: WorkspacePackage;
};

export const checkHasPackageSource = (props: CheckHasPackageSourceProps) => {
  const { packageInfo } = props;
  const sourceDirectoryPath = path.join(packageInfo.directory, `src`);
  const result = fs.existsSync(sourceDirectoryPath);

  return result;
};
