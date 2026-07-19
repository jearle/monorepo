import { type ResultError } from '@jearle/util-result';

export const TEMPLATE_INVALID_OPTIONS_ERROR_CODE = `TEMPLATE_INVALID_OPTIONS`;
export const TEMPLATE_PARSE_ERROR_CODE = `TEMPLATE_PARSE`;
export const TEMPLATE_RENDER_ERROR_CODE = `TEMPLATE_RENDER`;
export const TEMPLATE_FILE_RENDER_ERROR_CODE = `TEMPLATE_FILE_RENDER`;
export const TEMPLATE_ANALYZE_ERROR_CODE = `TEMPLATE_ANALYZE`;
export const TEMPLATE_MISSING_VARIABLE_ERROR_CODE = `TEMPLATE_MISSING_VARIABLE`;
export const TEMPLATE_SOURCE_ERROR_CODE = `TEMPLATE_SOURCE`;
export const TEMPLATE_IMPORT_ERROR_CODE = `TEMPLATE_IMPORT`;
export const TEMPLATE_IMPORT_CYCLE_ERROR_CODE = `TEMPLATE_IMPORT_CYCLE`;
export const TEMPLATE_SOURCE_LIMIT_ERROR_CODE = `TEMPLATE_SOURCE_LIMIT`;

export const TEMPLATE_INVALID_CACHE_ERROR = `template cache must be boolean or an integer at least 1`;
export const TEMPLATE_INVALID_FILTER_NAME_ERROR = `template filter names must be non-empty strings`;
export const TEMPLATE_INVALID_MEMORY_LIMIT_ERROR = `template memoryLimit must be an integer at least 1`;
export const TEMPLATE_INVALID_PARSE_LIMIT_ERROR = `template parseLimit must be an integer at least 1`;
export const TEMPLATE_INVALID_RENDER_LIMIT_ERROR = `template renderLimit must be an integer at least 1`;
export const TEMPLATE_INVALID_TEMPLATE_LIMIT_ERROR = `template templateLimit must be an integer at least 1`;
export const TEMPLATE_PARSE_ERROR = `failed to parse template`;
export const TEMPLATE_RENDER_ERROR = `failed to render template`;
export const TEMPLATE_FILE_RENDER_ERROR = `failed to render template file`;
export const TEMPLATE_ANALYZE_ERROR = `failed to analyze template`;
export const TEMPLATE_MISSING_VARIABLE_ERROR = `missing template variable`;
export const TEMPLATE_CREATE_CLIENT_ERROR = `failed to create template client`;
export const TEMPLATE_SOURCE_ERROR = `failed to process source template`;
export const TEMPLATE_ABSOLUTE_IMPORT_ERROR = `absolute template imports are not allowed`;
export const TEMPLATE_IMPORT_CYCLE_ERROR = `template import cycle detected`;
export const TEMPLATE_IMPORT_NOT_FOUND_ERROR = `template import was not found`;
export const TEMPLATE_SOURCE_GRAPH_LIMIT_ERROR = `source template graph exceeds configured limits`;
export const TEMPLATE_SOURCE_PARSE_AT_ERROR = `failed to parse template at`;
export const TEMPLATE_SOURCE_PATH_ERROR = `template source must be an existing absolute file`;
export const TEMPLATE_SOURCE_RENDER_LIMIT_ERROR = `source template render exceeds configured template limit`;

type CreateTemplateResultErrorProps = {
  readonly code: string;
  readonly message: string;
};

const createTemplateResultError = (props: CreateTemplateResultErrorProps) => {
  const { code, message } = props;
  const resultError: ResultError = {
    code,
    message,
  };

  return resultError;
};

export type CreateSourceTemplateResultErrorProps = {
  readonly code: string;
  readonly message: string;
};

export const createSourceTemplateResultError = (
  props: CreateSourceTemplateResultErrorProps,
) => {
  const resultError = createTemplateResultError(props);

  return resultError;
};

export type CreateTemplateInvalidOptionsResultErrorProps = {
  readonly message: string;
};

export const createTemplateInvalidOptionsResultError = (
  props: CreateTemplateInvalidOptionsResultErrorProps,
) => {
  const { message } = props;
  const resultError = createTemplateResultError({
    code: TEMPLATE_INVALID_OPTIONS_ERROR_CODE,
    message,
  });

  return resultError;
};

export const createTemplateParseResultError = () => {
  const resultError = createTemplateResultError({
    code: TEMPLATE_PARSE_ERROR_CODE,
    message: TEMPLATE_PARSE_ERROR,
  });

  return resultError;
};

export const createTemplateRenderResultError = () => {
  const resultError = createTemplateResultError({
    code: TEMPLATE_RENDER_ERROR_CODE,
    message: TEMPLATE_RENDER_ERROR,
  });

  return resultError;
};

export const createTemplateFileRenderResultError = () => {
  const resultError = createTemplateResultError({
    code: TEMPLATE_FILE_RENDER_ERROR_CODE,
    message: TEMPLATE_FILE_RENDER_ERROR,
  });

  return resultError;
};

export const createTemplateAnalyzeResultError = () => {
  const resultError = createTemplateResultError({
    code: TEMPLATE_ANALYZE_ERROR_CODE,
    message: TEMPLATE_ANALYZE_ERROR,
  });

  return resultError;
};

export const createTemplateMissingVariableResultError = () => {
  const resultError = createTemplateResultError({
    code: TEMPLATE_MISSING_VARIABLE_ERROR_CODE,
    message: TEMPLATE_MISSING_VARIABLE_ERROR,
  });

  return resultError;
};
