import {
  type PACKAGE_DIRECTORY_IGNORED_NAMES,
  type PATHS_RESULT_STATUSES,
  PATHS_RESULT_STATUS_ERROR,
  PATHS_RESULT_STATUS_SUCCESS,
} from './constants';

export type PackageDirectoryIgnoredName =
  (typeof PACKAGE_DIRECTORY_IGNORED_NAMES)[number];

export type PathsResultStatus = (typeof PATHS_RESULT_STATUSES)[number];

export type PathsResultError = {
  readonly code?: string;
  readonly message: string;
};

export type ReadPackageNamesData = {
  readonly packageNames: readonly string[];
};

export type ReadPackageNamesSuccessResult = {
  readonly status: typeof PATHS_RESULT_STATUS_SUCCESS;
  readonly data: ReadPackageNamesData;
};

export type ReadPackageNamesErrorResult = {
  readonly status: typeof PATHS_RESULT_STATUS_ERROR;
  readonly error: PathsResultError;
};

export type ReadPackageNamesResult =
  | ReadPackageNamesSuccessResult
  | ReadPackageNamesErrorResult;

export type ReadDirectoryNamesData = {
  readonly directoryNames: readonly string[];
};

export type ReadDirectoryNamesSuccessResult = {
  readonly status: typeof PATHS_RESULT_STATUS_SUCCESS;
  readonly data: ReadDirectoryNamesData;
};

export type ReadDirectoryNamesErrorResult = {
  readonly status: typeof PATHS_RESULT_STATUS_ERROR;
  readonly error: PathsResultError;
};

export type ReadDirectoryNamesResult =
  | ReadDirectoryNamesSuccessResult
  | ReadDirectoryNamesErrorResult;

export type FindRepoRootData = {
  readonly repoRoot: string;
};

export type FindRepoRootSuccessResult = {
  readonly status: typeof PATHS_RESULT_STATUS_SUCCESS;
  readonly data: FindRepoRootData;
};

export type FindRepoRootErrorResult = {
  readonly status: typeof PATHS_RESULT_STATUS_ERROR;
  readonly error: PathsResultError;
};

export type FindRepoRootResult =
  | FindRepoRootSuccessResult
  | FindRepoRootErrorResult;

export type ReadPackageFamiliesData = {
  readonly packageFamilies: readonly string[];
};

export type ReadPackageFamiliesSuccessResult = {
  readonly status: typeof PATHS_RESULT_STATUS_SUCCESS;
  readonly data: ReadPackageFamiliesData;
};

export type ReadPackageFamiliesErrorResult = {
  readonly status: typeof PATHS_RESULT_STATUS_ERROR;
  readonly error: PathsResultError;
};

export type ReadPackageFamiliesResult =
  | ReadPackageFamiliesSuccessResult
  | ReadPackageFamiliesErrorResult;
