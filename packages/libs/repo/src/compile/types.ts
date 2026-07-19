import { type ExecuteShellCommand } from '../shell-command';
import { type WorkflowResult } from '../workflow-result';

export type CompileOptions = {
  readonly runCommand?: ExecuteShellCommand;
};

export type CompileResult = WorkflowResult;
