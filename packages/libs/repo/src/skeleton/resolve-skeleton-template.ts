import path from 'node:path';

import {
  PATHS_RESULT_STATUS_ERROR,
  getPathExists,
  readPackageFamilies,
  resolvePackagePath,
} from '../paths';
import {
  SKELETON_RESULT_STATUS_ERROR,
  SKELETON_RESULT_STATUS_SUCCESS,
  SKELETON_TEMPLATE_NAME,
  SKELETON_TEMPLATE_SEPARATOR,
} from './constants';
import {
  createSkeletonTemplateDoesNotExistError,
  createTargetPackageAlreadyExistsError,
  createUnknownPackageFamilyError,
} from './errors';
import {
  type ResolveSkeletonTemplateResult,
  type SkeletonTemplate,
} from './types';

export type ResolveSkeletonTemplateProps = {
  readonly repoRoot: string;
  readonly packageFamily: string;
  readonly template?: string;
  readonly name: string;
};

export const resolveSkeletonTemplate = async (
  props: ResolveSkeletonTemplateProps,
): Promise<ResolveSkeletonTemplateResult> => {
  const { repoRoot, packageFamily, template, name } = props;
  const readPackageFamiliesResult = await readPackageFamilies({ repoRoot });
  const readPackageFamiliesHasError =
    readPackageFamiliesResult.status === PATHS_RESULT_STATUS_ERROR;

  if (readPackageFamiliesHasError) {
    const { error } = readPackageFamiliesResult;
    const result: ResolveSkeletonTemplateResult = {
      status: SKELETON_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const { packageFamilies } = readPackageFamiliesResult.data;
  const isKnownPackageFamily = packageFamilies.includes(packageFamily);

  if (isKnownPackageFamily === false) {
    const error = createUnknownPackageFamilyError({ packageFamily });
    const result: ResolveSkeletonTemplateResult = {
      status: SKELETON_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const templateName =
    template === undefined
      ? SKELETON_TEMPLATE_NAME
      : `${SKELETON_TEMPLATE_NAME}${SKELETON_TEMPLATE_SEPARATOR}${template}`;
  const { packagePath: sourcePath } = resolvePackagePath({
    repoRoot,
    packageFamily,
    packageName: templateName,
  });
  const { packagePath: targetPath } = resolvePackagePath({
    repoRoot,
    packageFamily,
    packageName: name,
  });
  const sourcePathExists = await getPathExists({ path: sourcePath });
  const targetPathExists = await getPathExists({ path: targetPath });

  if (sourcePathExists === false) {
    const error = createSkeletonTemplateDoesNotExistError({ sourcePath });
    const result: ResolveSkeletonTemplateResult = {
      status: SKELETON_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  if (targetPathExists) {
    const error = createTargetPackageAlreadyExistsError({ targetPath });
    const result: ResolveSkeletonTemplateResult = {
      status: SKELETON_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const relativeSourcePath = path.relative(repoRoot, sourcePath);
  const relativeTargetPath = path.relative(repoRoot, targetPath);
  const skeletonTemplate: SkeletonTemplate = {
    templateName,
    sourcePath,
    targetPath,
    relativeSourcePath,
    relativeTargetPath,
  };
  const result: ResolveSkeletonTemplateResult = {
    status: SKELETON_RESULT_STATUS_SUCCESS,
    data: {
      skeletonTemplate,
    },
  };

  return result;
};
