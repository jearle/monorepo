import { createError } from '@jearle/util-error';

export const ERROR_MESSAGE_INVALID_PACKAGE_NAME = `Invalid package name`;
export const ERROR_MESSAGE_UNKNOWN_PACKAGE_FAMILY = `Unknown package family`;
export const ERROR_MESSAGE_SKELETON_TEMPLATE_DOES_NOT_EXIST = `Skeleton template does not exist`;
export const ERROR_MESSAGE_TARGET_PACKAGE_ALREADY_EXISTS = `Target package already exists`;

export type CreateSkeletonErrorProps = {
  readonly error: unknown;
};

export const createSkeletonError = (props: CreateSkeletonErrorProps) => {
  const { error } = props;
  const { message } = createError(error);
  const result = {
    message,
  };

  return result;
};

export type CreateInvalidPackageNameErrorProps = {
  readonly name: string;
};

export const createInvalidPackageNameError = (
  props: CreateInvalidPackageNameErrorProps,
) => {
  const { name } = props;
  const result = {
    message: `${ERROR_MESSAGE_INVALID_PACKAGE_NAME}: ${name}`,
  };

  return result;
};

export type CreateUnknownPackageFamilyErrorProps = {
  readonly packageFamily: string;
};

export const createUnknownPackageFamilyError = (
  props: CreateUnknownPackageFamilyErrorProps,
) => {
  const { packageFamily } = props;
  const result = {
    message: `${ERROR_MESSAGE_UNKNOWN_PACKAGE_FAMILY}: ${packageFamily}`,
  };

  return result;
};

export type CreateSkeletonTemplateDoesNotExistErrorProps = {
  readonly sourcePath: string;
};

export const createSkeletonTemplateDoesNotExistError = (
  props: CreateSkeletonTemplateDoesNotExistErrorProps,
) => {
  const { sourcePath } = props;
  const result = {
    message: `${ERROR_MESSAGE_SKELETON_TEMPLATE_DOES_NOT_EXIST}: ${sourcePath}`,
  };

  return result;
};

export type CreateTargetPackageAlreadyExistsErrorProps = {
  readonly targetPath: string;
};

export const createTargetPackageAlreadyExistsError = (
  props: CreateTargetPackageAlreadyExistsErrorProps,
) => {
  const { targetPath } = props;
  const result = {
    message: `${ERROR_MESSAGE_TARGET_PACKAGE_ALREADY_EXISTS}: ${targetPath}`,
  };

  return result;
};
