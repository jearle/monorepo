import { type ExecuteShellCommand } from '../shell-command';
import { type WorkflowResult } from '../workflow-result';

export type FormatOptions = {
  readonly runCommand?: ExecuteShellCommand;
};

export type FormatResult = WorkflowResult;
