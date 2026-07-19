import { copyDirectory } from '@jearle/util-fs';

import {
  SKELETON_IGNORED_ENTRY_NAMES,
  SKELETON_RESULT_STATUS_ERROR,
  SKELETON_RESULT_STATUS_SUCCESS,
} from './constants';
import { replaceSkeletonMarkers } from './replace-skeleton-markers';
import {
  type CopyTemplateDirectoryResult,
  type PackageNameParts,
} from './types';

export type CopyTemplateDirectoryProps = {
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly nameParts: PackageNameParts;
};

export const copyTemplateDirectory = async (
  props: CopyTemplateDirectoryProps,
): Promise<CopyTemplateDirectoryResult> => {
  const { sourcePath, targetPath, nameParts } = props;
  const copyDirectoryResult = await copyDirectory({
    sourcePath,
    targetPath,
    ignoredNames: SKELETON_IGNORED_ENTRY_NAMES,
    transformEntryName: ({ name }) =>
      replaceSkeletonMarkers({
        value: name,
        nameParts,
      }),
    transformFileContents: ({ contents }) =>
      replaceSkeletonMarkers({
        value: contents,
        nameParts,
      }),
  });
  const hasError = copyDirectoryResult.status === SKELETON_RESULT_STATUS_ERROR;

  if (hasError) {
    const { error } = copyDirectoryResult;
    const result: CopyTemplateDirectoryResult = {
      status: SKELETON_RESULT_STATUS_ERROR,
      error,
    };
    return result;
  }

  const result: CopyTemplateDirectoryResult = {
    status: SKELETON_RESULT_STATUS_SUCCESS,
    data: {
      targetPath,
    },
  };
  return result;
};
