import { type ExecuteBufferedShellCommand } from '../shell-command';
import { type WorkflowResult } from '../workflow-result';

export type VerifyPackageExportsOptions = {
  readonly runCommand?: ExecuteBufferedShellCommand;
};

export type VerifyPackageExportsResult = WorkflowResult;
