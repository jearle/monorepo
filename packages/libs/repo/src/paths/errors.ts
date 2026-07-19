import { createError } from '@jearle/util-error';

export const ERROR_MESSAGE_FIND_REPO_ROOT_FAILED = `Unable to find repo root from`;

export type CreatePathsErrorProps = {
  readonly error: unknown;
};

export const createPathsError = (props: CreatePathsErrorProps) => {
  const { error } = props;
  const { message } = createError(error);
  const result = {
    message,
  };

  return result;
};

export type CreateFindRepoRootFailedErrorProps = {
  readonly directoryPath: string;
};

export const createFindRepoRootFailedError = (
  props: CreateFindRepoRootFailedErrorProps,
) => {
  const { directoryPath } = props;
  const result = {
    message: `${ERROR_MESSAGE_FIND_REPO_ROOT_FAILED} ${directoryPath}`,
  };

  return result;
};
