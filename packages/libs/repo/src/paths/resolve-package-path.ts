import path from 'node:path';

import { resolvePackageFamilyPath } from './resolve-package-family-path';

export type ResolvePackagePathProps = {
  readonly repoRoot: string;
  readonly packageFamily: string;
  readonly packageName: string;
};

export const resolvePackagePath = (props: ResolvePackagePathProps) => {
  const { repoRoot, packageFamily, packageName } = props;
  const { packageFamilyPath } = resolvePackageFamilyPath({
    repoRoot,
    packageFamily,
  });
  const packagePath = path.join(packageFamilyPath, packageName);

  const result = { packagePath };

  return result;
};
