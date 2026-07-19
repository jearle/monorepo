import { copyTemplateDirectory } from './copy-template-directory';
import { createPackageNameParts } from './create-package-name-parts';
import { resolveSkeletonTemplate } from './resolve-skeleton-template';
import {
  SKELETON_RESULT_STATUS_ERROR,
  SKELETON_RESULT_STATUS_SUCCESS,
} from './constants';
import { type CreateSkeletonPackageResult } from './types';

export type CreateSkeletonPackageProps = {
  readonly repoRoot: string;
  readonly packageFamily: string;
  readonly template?: string;
  readonly name: string;
};

export const createSkeletonPackage = async (
  props: CreateSkeletonPackageProps,
): Promise<CreateSkeletonPackageResult> => {
  const { name, packageFamily, repoRoot, template } = props;
  const createPackageNamePartsResult = createPackageNameParts({ name });
  const createPackageNamePartsHasFailure =
    createPackageNamePartsResult.status === SKELETON_RESULT_STATUS_ERROR;

  if (createPackageNamePartsHasFailure) {
    const { error } = createPackageNamePartsResult;
    const result: CreateSkeletonPackageResult = {
      status: SKELETON_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const { nameParts } = createPackageNamePartsResult.data;
  const resolveSkeletonTemplateResult = await resolveSkeletonTemplate({
    repoRoot,
    packageFamily,
    template,
    name,
  });
  const resolveSkeletonTemplateHasFailure =
    resolveSkeletonTemplateResult.status === SKELETON_RESULT_STATUS_ERROR;

  if (resolveSkeletonTemplateHasFailure) {
    const { error } = resolveSkeletonTemplateResult;
    const result: CreateSkeletonPackageResult = {
      status: SKELETON_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const { skeletonTemplate } = resolveSkeletonTemplateResult.data;
  const { sourcePath, targetPath } = skeletonTemplate;
  const copyTemplateDirectoryResult = await copyTemplateDirectory({
    sourcePath,
    targetPath,
    nameParts,
  });
  const copyTemplateDirectoryHasFailure =
    copyTemplateDirectoryResult.status === SKELETON_RESULT_STATUS_ERROR;

  if (copyTemplateDirectoryHasFailure) {
    const { error } = copyTemplateDirectoryResult;
    const result: CreateSkeletonPackageResult = {
      status: SKELETON_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const result: CreateSkeletonPackageResult = {
    status: SKELETON_RESULT_STATUS_SUCCESS,
    data: {
      skeletonPackage: skeletonTemplate,
    },
  };

  return result;
};
