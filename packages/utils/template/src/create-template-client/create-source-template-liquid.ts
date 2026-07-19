import { createLiquidOptions } from './create-liquid-options';
import { createSourceTemplateFileSystem } from './create-source-template-file-system';
import { createTemplateLimitedLiquid } from './create-template-limited-liquid';
import { registerTemplateFilters } from './register-template-filters';
import { type NormalizedTemplateClientOptions } from './types';
import { type SourceTemplateImportRoots } from '../types';
import {
  TEMPLATE_SOURCE_GRAPH_LIMIT_ERROR,
  TEMPLATE_SOURCE_LIMIT_ERROR_CODE,
} from '../errors';
import { createSourceTemplateFailure } from './errors';

const createUniquePaths = (paths: readonly string[]) => {
  const result = paths.filter((value, index) => {
    const isFirstOccurrence = paths.indexOf(value) === index;

    return isFirstOccurrence;
  });

  return result;
};

export type CreateSourceTemplateLiquidProps = {
  readonly extname: string;
  readonly importRoots?: SourceTemplateImportRoots;
  readonly options: NormalizedTemplateClientOptions;
  readonly sourceDirectoryPath: string;
};

export const createSourceTemplateLiquid = (
  props: CreateSourceTemplateLiquidProps,
) => {
  const { extname, importRoots, options, sourceDirectoryPath } = props;
  let lastReadPath: string | null = null;
  let parsedCharacters = 0;
  let parsedFileCount = 0;
  let templateLimit = options.templateLimit;
  const normalizePaths = (value: string | readonly string[] | undefined) => {
    if (value === undefined) {
      return [];
    }

    return typeof value === `string` ? [value] : [...value];
  };
  const configuredRoots =
    importRoots === undefined
      ? (options.root ?? [])
      : normalizePaths(importRoots.root);
  const configuredPartials =
    importRoots === undefined
      ? (options.partials ?? options.root ?? [])
      : normalizePaths(importRoots.partials ?? importRoots.root);
  const configuredLayouts =
    importRoots === undefined
      ? (options.layouts ?? options.root ?? [])
      : normalizePaths(importRoots.layouts ?? importRoots.root);
  const roots = createUniquePaths([sourceDirectoryPath, ...configuredRoots]);
  const partials = createUniquePaths([
    sourceDirectoryPath,
    ...configuredPartials,
  ]);
  const layouts = createUniquePaths([
    sourceDirectoryPath,
    ...configuredLayouts,
  ]);
  const limitedLiquid = createTemplateLimitedLiquid({
    initialTemplateLimit: options.templateLimit,
    liquidOptions: {
      ...createLiquidOptions({ options: { ...options, extname } }),
      cache: false,
      fs: createSourceTemplateFileSystem({
        onRead: (canonicalPath, content) => {
          lastReadPath = canonicalPath;
          parsedCharacters += content.length;
          parsedFileCount += 1;

          if (
            parsedCharacters > options.parseLimit ||
            parsedFileCount > templateLimit
          ) {
            throw createSourceTemplateFailure(
              TEMPLATE_SOURCE_GRAPH_LIMIT_ERROR,
              TEMPLATE_SOURCE_LIMIT_ERROR_CODE,
            );
          }
        },
      }),
      layouts: [...layouts],
      partials: [...partials],
      root: [...roots],
    },
  });
  const { liquid } = limitedLiquid;

  registerTemplateFilters({ filters: options.filters, liquid });

  type ResetLimitsProps = {
    readonly parsedCharacters: number;
    readonly templateLimit: number;
  };
  const resetLimits = (props: ResetLimitsProps) => {
    lastReadPath = null;
    parsedCharacters = props.parsedCharacters;
    parsedFileCount = 1;
    templateLimit = props.templateLimit;
    limitedLiquid.resetTemplateLimit(props.templateLimit);
  };

  const result = {
    clearLastReadPath: () => {
      lastReadPath = null;
    },
    getLastReadPath: () => lastReadPath,
    liquid,
    resetLimits,
  };

  return result;
};
