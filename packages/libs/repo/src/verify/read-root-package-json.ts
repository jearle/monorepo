import fs from 'node:fs';
import path from 'node:path';

import { RootPackageJsonSchema } from './root-package-json-schema';
import { type ReadRootPackageJsonResult } from './types';

export const readRootPackageJson = (
  repoRoot: string,
): ReadRootPackageJsonResult => {
  const packageJsonPath = path.join(repoRoot, `package.json`);
  const packageJsonText = fs.readFileSync(packageJsonPath, `utf8`);
  const packageJson: unknown = JSON.parse(packageJsonText);
  const parseResult = RootPackageJsonSchema.safeParse(packageJson);

  if (parseResult.success === false) {
    const result: ReadRootPackageJsonResult = {
      error: parseResult.error,
      success: false,
    };

    return result;
  }

  const result: ReadRootPackageJsonResult = {
    packageJson: parseResult.data,
    success: true,
  };

  return result;
};
