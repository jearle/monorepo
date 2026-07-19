import { type WorkflowResult } from '../workflow-result';
export type ForbiddenPackageScriptCommand = {
  readonly label: string;
  readonly pattern: RegExp;
};

export type PackageScriptRequirement = {
  readonly command: string;
  readonly name: string;
};

export type VerifyPackageScriptsOptions = Record<string, never>;

export type VerifyPackageScriptsResult = WorkflowResult;
