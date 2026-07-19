import path from 'node:path';

import { type WorkspacePackage } from '../workspace';
import { checkHasPackageFile } from './check-has-package-file';

const styleFileExtensions = new Set([`.css`, `.scss`]);

const checkIsStyleFilename = (filename: string) => {
  const extension = path.extname(filename);
  const result = styleFileExtensions.has(extension);

  return result;
};
export type CheckHasPackageStyleFileProps = {
  readonly packageInfo: WorkspacePackage;
};

export const checkHasPackageStyleFile = (
  props: CheckHasPackageStyleFileProps,
) => {
  const { packageInfo } = props;
  const result = checkHasPackageFile({
    checkIsFilename: checkIsStyleFilename,
    packageInfo,
  });

  return result;
};
