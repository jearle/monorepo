export type RepoWorkflowResult = {
  readonly exitCode: number;
};

export type RunRepoWorkflowProps = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};
