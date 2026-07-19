import { compilePackage } from './compile-package';
import { lintPackage } from './lint-package';
import { lintStylePackage } from './lint-style-package';
import { testPackage } from './test-package';
import { type PackageWorkflowProps, type VerifyPackageOptions } from './types';

export type VerifyPackageProps = PackageWorkflowProps;
export const verifyPackage = async (
  props: VerifyPackageProps,
  options: VerifyPackageOptions = {},
) => {
  const lintResult = await lintPackage(props, options);

  if (lintResult.exitCode !== 0) {
    return lintResult;
  }

  const lintStyleResult = await lintStylePackage(props, options);

  if (lintStyleResult.exitCode !== 0) {
    return lintStyleResult;
  }

  const compileResult = await compilePackage(props, options);

  if (compileResult.exitCode !== 0) {
    return compileResult;
  }

  const result = await testPackage(props, options);
  return result;
};
