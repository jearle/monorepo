import { type ExecuteShellCommand } from '../shell-command';
import { type WorkflowResult } from '../workflow-result';

export type VerifyDepsOptions = {
  readonly runCommand?: ExecuteShellCommand;
};

export type VerifyDepsResult = WorkflowResult;
