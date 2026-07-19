import { type WorkspacePackage } from '../workspace';
import {
  PACKAGE_SCRIPT_COMPILE,
  PACKAGE_SCRIPT_COMPILE_COMMAND,
  PACKAGE_SCRIPT_FORMAT,
  PACKAGE_SCRIPT_FORMAT_COMMAND,
  PACKAGE_SCRIPT_LINT,
  PACKAGE_SCRIPT_LINT_COMMAND,
  PACKAGE_SCRIPT_LINT_STYLE,
  PACKAGE_SCRIPT_LINT_STYLE_COMMAND,
  PACKAGE_SCRIPT_TEST,
  PACKAGE_SCRIPT_TEST_COMMAND,
  PACKAGE_SCRIPT_VERIFY,
  PACKAGE_SCRIPT_VERIFY_COMMAND,
} from './constants';
import { checkHasPackageFile } from './check-has-package-file';
import { checkHasPackageSource } from './check-has-package-source';
import { checkIsStyleFilename } from './check-is-style-filename';
import { checkIsTestFilename } from './check-is-test-filename';
import { type PackageScriptRequirement } from './types';

const checkShouldHaveLintStyleScript = (packageInfo: WorkspacePackage) => {
  if (packageInfo.family === `uis` || packageInfo.family === `composites`) {
    return true;
  }

  const result = checkHasPackageFile(packageInfo, checkIsStyleFilename);

  return result;
};

export const createExpectedScriptRequirements = (
  packageInfo: WorkspacePackage,
): readonly PackageScriptRequirement[] => {
  const baseRequirements: readonly PackageScriptRequirement[] = [
    {
      command: PACKAGE_SCRIPT_FORMAT_COMMAND,
      name: PACKAGE_SCRIPT_FORMAT,
    },
    {
      command: PACKAGE_SCRIPT_COMPILE_COMMAND,
      name: PACKAGE_SCRIPT_COMPILE,
    },
    {
      command: PACKAGE_SCRIPT_LINT_COMMAND,
      name: PACKAGE_SCRIPT_LINT,
    },
  ];
  const hasPackageSource = checkHasPackageSource(packageInfo);
  const hasPackageTests = checkHasPackageFile(packageInfo, checkIsTestFilename);
  const shouldHaveLintStyleScript = checkShouldHaveLintStyleScript(packageInfo);
  const testRequirements = hasPackageTests
    ? [
        {
          command: PACKAGE_SCRIPT_TEST_COMMAND,
          name: PACKAGE_SCRIPT_TEST,
        },
      ]
    : [];
  const verifyRequirements = hasPackageSource
    ? [
        {
          command: PACKAGE_SCRIPT_VERIFY_COMMAND,
          name: PACKAGE_SCRIPT_VERIFY,
        },
      ]
    : [];
  const lintStyleRequirements = shouldHaveLintStyleScript
    ? [
        {
          command: PACKAGE_SCRIPT_LINT_STYLE_COMMAND,
          name: PACKAGE_SCRIPT_LINT_STYLE,
        },
      ]
    : [];
  const result = [
    ...baseRequirements,
    ...testRequirements,
    ...verifyRequirements,
    ...lintStyleRequirements,
  ];

  return result;
};
