import { type Result } from '@jearle/util-result';

export type TemplateData = Readonly<Record<string, unknown>>;

export type TemplateFilter = (
  value: unknown,
  ...args: unknown[]
) => unknown | Promise<unknown>;

export type TemplateFilters = Readonly<Record<string, TemplateFilter>>;

export type TemplateClientOptions = {
  readonly cache?: boolean | number;
  readonly extname?: string;
  readonly filters?: TemplateFilters;
  readonly globals?: TemplateData;
  readonly layouts?: string | readonly string[];
  readonly memoryLimit?: number;
  readonly ownPropertyOnly?: boolean;
  readonly parseLimit?: number;
  readonly partials?: string | readonly string[];
  readonly renderLimit?: number;
  readonly root?: string | readonly string[];
  readonly strictFilters?: boolean;
  readonly strictVariables?: boolean;
  readonly templateLimit?: number;
};

export type TemplateRenderOptions = {
  readonly globals?: TemplateData;
  readonly memoryLimit?: number;
  readonly ownPropertyOnly?: boolean;
  readonly renderLimit?: number;
  readonly strictVariables?: boolean;
  readonly templateLimit?: number;
};

export type SourceTemplateImportRoots = {
  readonly layouts?: string | readonly string[];
  readonly partials?: string | readonly string[];
  readonly root?: string | readonly string[];
};

/**
 * Inline Liquid text paired with the existing absolute file path where it was
 * authored. The path is operation metadata and is canonicalized before imports
 * resolve; it is not added to template data.
 */
export type SourceTemplate = {
  readonly extname?: string;
  readonly importRoots?: SourceTemplateImportRoots;
  readonly sourcePath: string;
  readonly template: string;
};

export type TemplateAnalysis = {
  readonly variables: readonly string[];
};

export type SourceTemplateDependencyAnalysis = {
  readonly hasDynamicFileImports: boolean;
  readonly staticImportPaths: readonly string[];
};

export type TemplateRenderResult = Result<string>;
export type TemplateAnalyzeResult = Result<TemplateAnalysis>;
export type SourceTemplateDependencyAnalysisResult =
  Result<SourceTemplateDependencyAnalysis>;
export type TemplateParseData = {
  readonly hasFileImports: boolean;
};
export type TemplateParseOptions = {
  readonly resolveStaticImports?: boolean;
};
export type TemplateParseResult = Result<TemplateParseData>;

export type TemplateClient = {
  readonly analyze: (template: string) => TemplateAnalyzeResult;
  /** Resolves source-aware static imports without rendering templates. */
  readonly analyzeSourceDependencies: (
    source: SourceTemplate,
  ) => Promise<SourceTemplateDependencyAnalysisResult>;
  /** Parses inline Liquid and, by default, static imports from client roots. */
  readonly parse: (
    template: string,
    options?: TemplateParseOptions,
  ) => Promise<TemplateParseResult>;
  /** Parses an authored template and every statically named import. */
  readonly parseSource: (
    source: SourceTemplate,
  ) => Promise<TemplateParseResult>;
  readonly render: (
    template: string,
    data: TemplateData,
    options?: TemplateRenderOptions,
  ) => Promise<TemplateRenderResult>;
  readonly renderFile: (
    filePath: string,
    data: TemplateData,
    options?: TemplateRenderOptions,
  ) => Promise<TemplateRenderResult>;
  /**
   * Parses the root template, then performs one native Liquid render using the
   * authored path. Imports resolve only when their branch is reached.
   */
  readonly renderSource: (
    source: SourceTemplate,
    data: TemplateData,
    options?: TemplateRenderOptions,
  ) => Promise<TemplateRenderResult>;
};

export type CreateTemplateClientProps = TemplateClientOptions;

export type CreatedTemplateClient = {
  readonly templateClient: TemplateClient;
};
