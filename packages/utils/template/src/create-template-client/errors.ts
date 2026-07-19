import { type ResultError, wrapResultError } from '@jearle/util-result';

import {
  TEMPLATE_CREATE_CLIENT_ERROR,
  TEMPLATE_SOURCE_ERROR_CODE,
  createTemplateFileRenderResultError,
  createTemplateInvalidOptionsResultError,
  createTemplateMissingVariableResultError,
  createTemplateParseResultError,
  createTemplateRenderResultError,
} from '../errors';

import { checkIsLiquidMissingVariableError } from './check-is-liquid-missing-variable-error';
import { checkIsLiquidParseError } from './check-is-liquid-parse-error';

const SOURCE_TEMPLATE_FAILURE = Symbol(`SOURCE_TEMPLATE_FAILURE`);

export const createSourceTemplateImportContext = (chain: readonly string[]) => {
  const result = ` (import chain: ${chain.join(` -> `)})`;

  return result;
};

export type SourceTemplateFailure = {
  readonly code: string;
  readonly message: string;
};

export const createSourceTemplateFailure = (
  message: string,
  code = TEMPLATE_SOURCE_ERROR_CODE,
) => {
  const result = new Error(message, {
    cause: Object.freeze({ code, kind: SOURCE_TEMPLATE_FAILURE }),
  });

  return result;
};

const getSourceTemplateFailureAtDepth = (
  error: unknown,
  depth: number,
): SourceTemplateFailure | null => {
  if (error instanceof Error === false || depth >= 8) {
    return null;
  }

  if (
    typeof error.cause === `object` &&
    error.cause !== null &&
    Object.hasOwn(error.cause, `code`) &&
    Reflect.get(error.cause, `kind`) === SOURCE_TEMPLATE_FAILURE
  ) {
    const code: unknown = Reflect.get(error.cause, `code`);
    const result =
      typeof code === `string` ? { code, message: error.message } : null;

    return result;
  }

  const originalError: unknown = Reflect.get(error, `originalError`);
  const nestedFailure = getSourceTemplateFailureAtDepth(
    originalError,
    depth + 1,
  );

  const result =
    nestedFailure ?? getSourceTemplateFailureAtDepth(error.cause, depth + 1);

  return result;
};

export const getSourceTemplateFailure = (error: unknown) => {
  const result = getSourceTemplateFailureAtDepth(error, 0);

  return result;
};

export const createTemplateClientContextError = () => {
  const error = createTemplateInvalidOptionsResultError({
    message: TEMPLATE_CREATE_CLIENT_ERROR,
  });
  const result = wrapResultError({ error });

  return result;
};

export type CreateTemplateResultErrorFromLiquidFileRenderErrorProps = {
  readonly error: unknown;
};

export const createTemplateResultErrorFromLiquidFileRenderError = (
  props: CreateTemplateResultErrorFromLiquidFileRenderErrorProps,
): ResultError => {
  const { error } = props;

  if (checkIsLiquidMissingVariableError(error)) {
    const resultError = createTemplateMissingVariableResultError();

    return resultError;
  }

  if (checkIsLiquidParseError(error)) {
    const resultError = createTemplateParseResultError();

    return resultError;
  }

  const resultError = createTemplateFileRenderResultError();

  return resultError;
};

export type CreateTemplateResultErrorFromLiquidRenderErrorProps = {
  readonly error: unknown;
};

export const createTemplateResultErrorFromLiquidRenderError = (
  props: CreateTemplateResultErrorFromLiquidRenderErrorProps,
) => {
  const { error } = props;

  if (checkIsLiquidMissingVariableError(error)) {
    const resultError = createTemplateMissingVariableResultError();

    return resultError;
  }

  if (checkIsLiquidParseError(error)) {
    const resultError = createTemplateParseResultError();

    return resultError;
  }

  const resultError = createTemplateRenderResultError();

  return resultError;
};
