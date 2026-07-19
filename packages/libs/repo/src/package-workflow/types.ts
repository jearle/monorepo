import { type ExecuteShellCommand } from '../shell-command';
import { type WorkflowResult } from '../workflow-result';
import { type WorkspacePackage } from '../workspace';

export type PackageWorkflowProps = {
  readonly cwd: string;
};

export type PackageWorkflowOptions = {
  readonly runCommand?: ExecuteShellCommand;
};

export type PackageWorkflowContext = {
  readonly packageInfo: WorkspacePackage;
  readonly repoRoot: string;
};

export type TestPackageOptions = PackageWorkflowOptions;

export type TestPackageResult = WorkflowResult;

export type FormatPackageOptions = PackageWorkflowOptions;

export type FormatPackageResult = WorkflowResult;

export type VerifyPackageOptions = PackageWorkflowOptions;

export type VerifyPackageResult = WorkflowResult;

export type LintStylePackageOptions = PackageWorkflowOptions;

export type LintStylePackageResult = WorkflowResult;

export type LintPackageOptions = PackageWorkflowOptions;

export type LintPackageResult = WorkflowResult;

export type CompilePackageOptions = PackageWorkflowOptions;

export type CompilePackageResult = WorkflowResult;
