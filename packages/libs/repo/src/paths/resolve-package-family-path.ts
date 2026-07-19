import path from 'node:path';

import { PACKAGES_DIRECTORY_NAME } from './constants';

export type ResolvePackageFamilyPathProps = {
  readonly repoRoot: string;
  readonly packageFamily: string;
};

export const resolvePackageFamilyPath = (
  props: ResolvePackageFamilyPathProps,
) => {
  const { repoRoot, packageFamily } = props;
  const packageFamilyPath = path.join(
    repoRoot,
    PACKAGES_DIRECTORY_NAME,
    packageFamily,
  );

  const result = { packageFamilyPath };

  return result;
};
