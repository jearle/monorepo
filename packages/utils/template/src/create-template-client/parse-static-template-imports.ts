import { type Template, LookupType, toPromise } from 'liquidjs';

import {
  TEMPLATE_IMPORT_CYCLE_ERROR,
  TEMPLATE_IMPORT_CYCLE_ERROR_CODE,
  TEMPLATE_IMPORT_ERROR_CODE,
  TEMPLATE_IMPORT_NOT_FOUND_ERROR,
  TEMPLATE_PARSE_ERROR_CODE,
  TEMPLATE_SOURCE_GRAPH_LIMIT_ERROR,
  TEMPLATE_SOURCE_LIMIT_ERROR_CODE,
  TEMPLATE_SOURCE_PARSE_AT_ERROR,
} from '../errors';
import { createSourceTemplateImportLabel } from './create-source-template-import-label';
import { checkIsLiquidParseError } from './check-is-liquid-parse-error';
import {
  createSourceTemplateFailure,
  createSourceTemplateImportContext,
  getSourceTemplateFailure,
} from './errors';
import { findSourceTemplateImports } from './find-source-template-imports';
import {
  type ParseStaticTemplateImportsProps,
  type StaticTemplateImportState,
  type VisitStaticTemplateImportsProps,
} from './static-template-import-types';

const visitStaticTemplateImports = async (
  props: VisitStaticTemplateImportsProps,
): Promise<StaticTemplateImportState> => {
  let state = props.state;

  for (const templateImport of findSourceTemplateImports(props.templates)) {
    state = { ...state, hasFileImports: true };

    if (templateImport.dynamic || templateImport.request === null) {
      state = { ...state, hasDynamicFileImports: true };
      continue;
    }

    const targetLabel = createSourceTemplateImportLabel({
      currentLabel: props.chain.at(-1) ?? `template`,
      extname: props.extname,
      importName: templateImport.request,
    });
    const nextChain = [...props.chain, targetLabel];
    const lookupType =
      templateImport.kind === `layouts`
        ? LookupType.Layouts
        : LookupType.Partials;
    let importedTemplates: Template[];

    props.beforeImport?.();

    try {
      importedTemplates = await toPromise(
        props.parser.parseFile(
          templateImport.request,
          false,
          lookupType,
          props.currentFilePath,
        ),
      );
    } catch (error) {
      const failure = getSourceTemplateFailure(error);
      const isParseError = checkIsLiquidParseError(error);
      const message =
        failure?.message ??
        (isParseError
          ? `${TEMPLATE_SOURCE_PARSE_AT_ERROR} ${targetLabel}`
          : TEMPLATE_IMPORT_NOT_FOUND_ERROR);
      const code =
        failure?.code ??
        (isParseError ? TEMPLATE_PARSE_ERROR_CODE : TEMPLATE_IMPORT_ERROR_CODE);

      throw createSourceTemplateFailure(
        `${message}${createSourceTemplateImportContext(nextChain)}`,
        code,
      );
    }

    const target = props.resolveTarget({
      currentFilePath: props.currentFilePath,
      importedTemplates,
      lookupType,
      request: templateImport.request,
    });

    if (target === null) {
      throw createSourceTemplateFailure(
        `${TEMPLATE_IMPORT_NOT_FOUND_ERROR}${createSourceTemplateImportContext(nextChain)}`,
        TEMPLATE_IMPORT_ERROR_CODE,
      );
    }

    if (props.stack.includes(target.identity)) {
      throw createSourceTemplateFailure(
        `${TEMPLATE_IMPORT_CYCLE_ERROR}${createSourceTemplateImportContext(nextChain)}`,
        TEMPLATE_IMPORT_CYCLE_ERROR_CODE,
      );
    }

    const staticImportPaths =
      target.filePath === undefined ||
      state.staticImportPaths.includes(target.filePath)
        ? state.staticImportPaths
        : [...state.staticImportPaths, target.filePath];
    state = { ...state, staticImportPaths };

    if (state.visited.includes(target.identity)) {
      continue;
    }

    if (state.templateCount >= props.templateLimit) {
      throw createSourceTemplateFailure(
        `${TEMPLATE_SOURCE_GRAPH_LIMIT_ERROR}${createSourceTemplateImportContext(nextChain)}`,
        TEMPLATE_SOURCE_LIMIT_ERROR_CODE,
      );
    }

    state = await visitStaticTemplateImports({
      ...props,
      chain: nextChain,
      currentFilePath: target.filePath,
      stack: [...props.stack, target.identity],
      state: {
        ...state,
        templateCount: state.templateCount + 1,
        visited: [...state.visited, target.identity],
      },
      templates: importedTemplates,
    });
  }

  return state;
};

export const parseStaticTemplateImports = async (
  props: ParseStaticTemplateImportsProps,
) => {
  const initialVisited =
    props.initialIdentity === undefined ? [] : [props.initialIdentity];
  const state = await visitStaticTemplateImports({
    ...(props.beforeImport === undefined
      ? {}
      : { beforeImport: props.beforeImport }),
    chain: [props.sourceLabel],
    currentFilePath: props.currentFilePath,
    extname: props.extname,
    parser: props.parser,
    resolveTarget: props.resolveTarget,
    stack: [...initialVisited],
    state: {
      hasDynamicFileImports: false,
      hasFileImports: false,
      staticImportPaths: [],
      templateCount: 1,
      visited: initialVisited,
    },
    templateLimit: props.templateLimit,
    templates: props.templates,
  });
  const staticImportPaths = state.staticImportPaths.toSorted();
  const result = {
    hasDynamicFileImports: state.hasDynamicFileImports,
    hasFileImports: state.hasFileImports,
    staticImportPaths,
  };

  return result;
};
