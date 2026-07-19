import { type LookupType, type Parser, type Template } from 'liquidjs';

export type StaticTemplateImportTarget = {
  readonly filePath?: string;
  readonly identity: string;
};

export type ResolveStaticTemplateImportTargetProps = {
  readonly currentFilePath: string | undefined;
  readonly importedTemplates: readonly Template[];
  readonly lookupType: LookupType;
  readonly request: string;
};

export type ResolveStaticTemplateImportTarget = (
  props: ResolveStaticTemplateImportTargetProps,
) => StaticTemplateImportTarget | null;

export type StaticTemplateImportAnalysis = {
  readonly hasDynamicFileImports: boolean;
  readonly hasFileImports: boolean;
  readonly staticImportPaths: readonly string[];
};

export type StaticTemplateImportTraversalState = {
  readonly templateCount: number;
  readonly visited: readonly string[];
};

export type StaticTemplateImportState = StaticTemplateImportAnalysis &
  StaticTemplateImportTraversalState;

export type VisitStaticTemplateImportsProps = {
  readonly beforeImport?: () => void;
  readonly chain: readonly string[];
  readonly currentFilePath: string | undefined;
  readonly extname: string;
  readonly parser: Parser;
  readonly resolveTarget: ResolveStaticTemplateImportTarget;
  readonly stack: readonly string[];
  readonly state: StaticTemplateImportState;
  readonly templateLimit: number;
  readonly templates: readonly Template[];
};

export type ParseStaticTemplateImportsProps = {
  readonly beforeImport?: () => void;
  readonly currentFilePath?: string;
  readonly extname: string;
  readonly initialIdentity?: string;
  readonly parser: Parser;
  readonly resolveTarget: ResolveStaticTemplateImportTarget;
  readonly sourceLabel: string;
  readonly templateLimit: number;
  readonly templates: readonly Template[];
};
