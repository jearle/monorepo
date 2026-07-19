import { type ZodError } from 'zod';

import {
  type ExecuteBufferedShellCommand,
  type ExecuteShellCommand,
  type ExecuteStreamingShellCommand,
} from '../shell-command';
import {
  type VerifyPackageExportsOptions,
  type VerifyPackageExportsProps,
  type VerifyPackageExportsResult,
} from '../verify-package-exports';
import {
  type VerifyPackageScriptsOptions,
  type VerifyPackageScriptsProps,
  type VerifyPackageScriptsResult,
} from '../verify-package-scripts';
import { type WorkflowResult } from '../workflow-result';

export type VerifyPackageExportsWorkflow = (
  props: VerifyPackageExportsProps,
  options?: VerifyPackageExportsOptions,
) => Promise<VerifyPackageExportsResult>;

export type VerifyPackageScriptsWorkflow = (
  props: VerifyPackageScriptsProps,
  options?: VerifyPackageScriptsOptions,
) => Promise<VerifyPackageScriptsResult>;

export type VerifyOptions = {
  readonly runBufferedCommand?: ExecuteBufferedShellCommand;
  readonly runCommand?: ExecuteShellCommand;
  readonly runStreamingCommand?: ExecuteStreamingShellCommand;
  readonly verifyPackageExports?: VerifyPackageExportsWorkflow;
  readonly verifyPackageScripts?: VerifyPackageScriptsWorkflow;
};

export type VerifyResult = WorkflowResult;

export type RootPackageJson = {
  readonly scripts: Readonly<Record<string, string>>;
};
export type ReadRootPackageJsonResultFailure = {
  readonly error: ZodError;
  readonly success: false;
};

export type ReadRootPackageJsonResultSuccess = {
  readonly packageJson: RootPackageJson;
  readonly success: true;
};

export type ReadRootPackageJsonResult =
  | ReadRootPackageJsonResultSuccess
  | ReadRootPackageJsonResultFailure;

export type RunStylelintOptions = {
  readonly runCommand?: ExecuteShellCommand;
};
