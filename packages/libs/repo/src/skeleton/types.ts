import {
  type SKELETON_IGNORED_ENTRY_NAMES,
  type SKELETON_RESULT_STATUSES,
  SKELETON_RESULT_STATUS_ERROR,
  SKELETON_RESULT_STATUS_SUCCESS,
} from './constants';

export type SkeletonIgnoredEntryName =
  (typeof SKELETON_IGNORED_ENTRY_NAMES)[number];

export type SkeletonResultStatus = (typeof SKELETON_RESULT_STATUSES)[number];

export type SkeletonResultError = {
  readonly code?: string;
  readonly message: string;
};

export type PackageNameParts = {
  readonly kebab: string;
  readonly camel: string;
  readonly pascal: string;
  readonly constant: string;
};

export type SkeletonTemplate = {
  readonly templateName: string;
  readonly sourcePath: string;
  readonly targetPath: string;
  readonly relativeSourcePath: string;
  readonly relativeTargetPath: string;
};

export type CreatePackageNamePartsData = {
  readonly nameParts: PackageNameParts;
};

export type CreatePackageNamePartsSuccessResult = {
  readonly status: typeof SKELETON_RESULT_STATUS_SUCCESS;
  readonly data: CreatePackageNamePartsData;
};

export type CreatePackageNamePartsErrorResult = {
  readonly status: typeof SKELETON_RESULT_STATUS_ERROR;
  readonly error: SkeletonResultError;
};

export type CreatePackageNamePartsResult =
  | CreatePackageNamePartsSuccessResult
  | CreatePackageNamePartsErrorResult;

export type ResolveSkeletonTemplateData = {
  readonly skeletonTemplate: SkeletonTemplate;
};

export type ResolveSkeletonTemplateSuccessResult = {
  readonly status: typeof SKELETON_RESULT_STATUS_SUCCESS;
  readonly data: ResolveSkeletonTemplateData;
};

export type ResolveSkeletonTemplateErrorResult = {
  readonly status: typeof SKELETON_RESULT_STATUS_ERROR;
  readonly error: SkeletonResultError;
};

export type ResolveSkeletonTemplateResult =
  | ResolveSkeletonTemplateSuccessResult
  | ResolveSkeletonTemplateErrorResult;

export type CreateSkeletonPackageData = {
  readonly skeletonPackage: SkeletonTemplate;
};

export type CreateSkeletonPackageSuccessResult = {
  readonly status: typeof SKELETON_RESULT_STATUS_SUCCESS;
  readonly data: CreateSkeletonPackageData;
};

export type CreateSkeletonPackageErrorResult = {
  readonly status: typeof SKELETON_RESULT_STATUS_ERROR;
  readonly error: SkeletonResultError;
};

export type CreateSkeletonPackageResult =
  | CreateSkeletonPackageSuccessResult
  | CreateSkeletonPackageErrorResult;

export type CopyTemplateDirectoryData = {
  readonly targetPath: string;
};

export type CopyTemplateDirectorySuccessResult = {
  readonly status: typeof SKELETON_RESULT_STATUS_SUCCESS;
  readonly data: CopyTemplateDirectoryData;
};

export type CopyTemplateDirectoryErrorResult = {
  readonly status: typeof SKELETON_RESULT_STATUS_ERROR;
  readonly error: SkeletonResultError;
};

export type CopyTemplateDirectoryResult =
  | CopyTemplateDirectorySuccessResult
  | CopyTemplateDirectoryErrorResult;
