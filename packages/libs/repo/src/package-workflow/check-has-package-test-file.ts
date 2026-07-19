import { type WorkspacePackage } from '../workspace';
import { checkHasPackageFile } from './check-has-package-file';

const checkIsTestFilename = (filename: string) => {
  const result =
    filename.includes(`.test.`) ||
    filename.includes(`_test_`) ||
    filename.includes(`.spec.`) ||
    filename.includes(`_spec_`);

  return result;
};
export type CheckHasPackageTestFileProps = {
  readonly packageInfo: WorkspacePackage;
};

export const checkHasPackageTestFile = (
  props: CheckHasPackageTestFileProps,
) => {
  const { packageInfo } = props;
  const result = checkHasPackageFile({
    checkIsFilename: checkIsTestFilename,
    packageInfo,
  });
  return result;
};
