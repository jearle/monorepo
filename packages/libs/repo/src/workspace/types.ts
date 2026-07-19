export type WorkspacePackageJson = {
  readonly exports?: unknown;
  readonly name: string;
  readonly private?: boolean;
  readonly scripts?: Readonly<Record<string, string>>;
  readonly version?: string;
};

export type WorkspacePackage = {
  readonly directory: string;
  readonly directoryName: string;
  readonly family: string;
  readonly name: string;
  readonly packageJson: WorkspacePackageJson;
  readonly relativeDirectory: string;
};
