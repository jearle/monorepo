import {
  type Result,
  createResultSuccess,
  wrapResultError,
} from '@jearle/util-result';
import { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';

import {
  DEFAULT_TEMPLATE_CACHE_SIZE,
  DEFAULT_TEMPLATE_LIMIT,
  DEFAULT_TEMPLATE_MEMORY_LIMIT,
  DEFAULT_TEMPLATE_PARSE_LIMIT,
  DEFAULT_TEMPLATE_RENDER_LIMIT,
} from '../constants';
import {
  TEMPLATE_INVALID_CACHE_ERROR,
  TEMPLATE_INVALID_FILTER_NAME_ERROR,
  TEMPLATE_INVALID_MEMORY_LIMIT_ERROR,
  TEMPLATE_INVALID_PARSE_LIMIT_ERROR,
  TEMPLATE_INVALID_RENDER_LIMIT_ERROR,
  TEMPLATE_INVALID_TEMPLATE_LIMIT_ERROR,
  createTemplateInvalidOptionsResultError,
} from '../errors';
import { type CreateTemplateClientProps } from '../types';
import {
  type NormalizeTemplateClientOptionsResult,
  type NormalizedTemplateClientOptions,
} from './types';

type CreateInvalidOptionsResultProps = {
  readonly message: string;
};

const createInvalidOptionsResult = (
  props: CreateInvalidOptionsResultProps,
): Result<NormalizedTemplateClientOptions> => {
  const { message } = props;
  const error = createTemplateInvalidOptionsResultError({ message });
  const result = wrapResultError({ error });

  return result;
};

const checkIsValidLimit = (value: number) => {
  const result = Number.isInteger(value) && value >= 1;

  return result;
};

const checkIsValidCache = (value: boolean | number) => {
  if (typeof value === `boolean`) {
    return true;
  }

  const result = Number.isInteger(value) && value >= 1;

  return result;
};

const checkHasInvalidFilterName = (
  filters: CreateTemplateClientProps[`filters`],
) => {
  if (filters === undefined) {
    return false;
  }

  const filterNames = Object.keys(filters);
  const result = filterNames.some((filterName) => filterName.length === 0);

  return result;
};

type DirectoryOption = string | readonly string[] | undefined;

const normalizeDirectoryOption = (value: DirectoryOption) => {
  if (value === undefined) {
    return undefined;
  }

  const directoryPaths = typeof value === `string` ? [value] : value;
  const canonicalPaths = directoryPaths.map((directoryPath) => {
    const absolutePath = path.resolve(directoryPath);
    const result = existsSync(absolutePath)
      ? realpathSync(absolutePath)
      : absolutePath;

    return result;
  });
  const result = canonicalPaths.filter((directoryPath, index) => {
    const isFirstOccurrence = canonicalPaths.indexOf(directoryPath) === index;

    return isFirstOccurrence;
  });

  return result;
};

export const normalizeTemplateClientOptions = (
  props: CreateTemplateClientProps,
): NormalizeTemplateClientOptionsResult => {
  const cache = props.cache ?? DEFAULT_TEMPLATE_CACHE_SIZE;
  const memoryLimit = props.memoryLimit ?? DEFAULT_TEMPLATE_MEMORY_LIMIT;
  const parseLimit = props.parseLimit ?? DEFAULT_TEMPLATE_PARSE_LIMIT;
  const renderLimit = props.renderLimit ?? DEFAULT_TEMPLATE_RENDER_LIMIT;
  const templateLimit = props.templateLimit ?? DEFAULT_TEMPLATE_LIMIT;

  if (!checkIsValidCache(cache)) {
    const result = createInvalidOptionsResult({
      message: TEMPLATE_INVALID_CACHE_ERROR,
    });

    return result;
  }

  if (!checkIsValidLimit(memoryLimit)) {
    const result = createInvalidOptionsResult({
      message: TEMPLATE_INVALID_MEMORY_LIMIT_ERROR,
    });

    return result;
  }

  if (!checkIsValidLimit(parseLimit)) {
    const result = createInvalidOptionsResult({
      message: TEMPLATE_INVALID_PARSE_LIMIT_ERROR,
    });

    return result;
  }

  if (!checkIsValidLimit(renderLimit)) {
    const result = createInvalidOptionsResult({
      message: TEMPLATE_INVALID_RENDER_LIMIT_ERROR,
    });

    return result;
  }

  if (!checkIsValidLimit(templateLimit)) {
    const result = createInvalidOptionsResult({
      message: TEMPLATE_INVALID_TEMPLATE_LIMIT_ERROR,
    });

    return result;
  }

  if (checkHasInvalidFilterName(props.filters)) {
    const result = createInvalidOptionsResult({
      message: TEMPLATE_INVALID_FILTER_NAME_ERROR,
    });

    return result;
  }

  const options: NormalizedTemplateClientOptions = {
    cache,
    extname: props.extname,
    filters: props.filters,
    globals: props.globals,
    layouts: normalizeDirectoryOption(props.layouts),
    memoryLimit,
    ownPropertyOnly: props.ownPropertyOnly ?? true,
    parseLimit,
    partials: normalizeDirectoryOption(props.partials),
    renderLimit,
    root: normalizeDirectoryOption(props.root),
    strictFilters: props.strictFilters ?? true,
    strictVariables: props.strictVariables ?? true,
    templateLimit,
  };
  const result = createResultSuccess({ data: options });

  return result;
};
