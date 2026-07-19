import { type ExecuteShellCommand } from '../shell-command';
import { type WorkflowResult } from '../workflow-result';

export type LintOptions = {
  readonly runCommand?: ExecuteShellCommand;
};

export type LintResult = WorkflowResult;
