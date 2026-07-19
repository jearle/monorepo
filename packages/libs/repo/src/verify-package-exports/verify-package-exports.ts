import { type Job, type JobCompletion, runJobs } from '@jearle/util-jobs';
import {
  type ExecuteBufferedShellCommand,
  executeBufferedShellCommand,
} from '../shell-command';
import { createWorkflowResult } from '../workflow-result';
import {
  type WorkspacePackage,
  checkIsArchivedPackage,
  checkIsSkeletonPackage,
  filterRunnablePackages,
  normalizeFilePaths,
  readWorkspacePackages,
  resolveAffectedPackages,
  resolveWorkspaceRepoRoot,
} from '../workspace';

import { type VerifyPackageExportsOptions } from './types';

const skippedPackageFamilies = new Map([
  [
    `apps`,
    `application packages ship deploy artifacts instead of reusable package exports`,
  ],
  [
    `configs`,
    `private configuration packages are validated by lint and compile tasks`,
  ],
]);

const PACKAGE_EXPORT_PROGRESS_INTERVAL = 10;
const DEFAULT_REPO_JOB_CONCURRENCY = 4;

type SkippedPackageInfo = {
  readonly packageInfo: WorkspacePackage;
  readonly reason: string;
};

type PackageExportPlan = {
  readonly attwPackages: readonly WorkspacePackage[];
  readonly publintPackages: readonly WorkspacePackage[];
  readonly skippedPackages: readonly SkippedPackageInfo[];
};

const checkShouldRunFullWorkflow = (filePaths: readonly string[]) =>
  filePaths.length === 0;

const checkHasExports = (packageInfo: WorkspacePackage) =>
  packageInfo.packageJson.exports !== undefined;

const checkIsPrivatePackage = (packageInfo: WorkspacePackage) =>
  packageInfo.packageJson.private === true;

const createSkipReason = (packageInfo: WorkspacePackage) => {
  const packageFamilyReason = skippedPackageFamilies.get(packageInfo.family);

  if (checkIsSkeletonPackage(packageInfo)) {
    return `template package`;
  }

  if (checkIsArchivedPackage(packageInfo)) {
    return `archived package`;
  }

  if (packageFamilyReason !== undefined) {
    return packageFamilyReason;
  }

  if (checkIsPrivatePackage(packageInfo)) {
    return `private package`;
  }

  if (checkHasExports(packageInfo) === false) {
    return `no package exports`;
  }

  return null;
};

const createPackageExportPlan = (packageInfos: readonly WorkspacePackage[]) => {
  const initialPlan: PackageExportPlan = {
    attwPackages: [],
    publintPackages: [],
    skippedPackages: [],
  };
  const result = packageInfos.reduce<PackageExportPlan>(
    (currentPlan, packageInfo) => {
      const skipReason = createSkipReason(packageInfo);

      if (skipReason !== null) {
        const nextPlan = {
          ...currentPlan,
          skippedPackages: [
            ...currentPlan.skippedPackages,
            { packageInfo, reason: skipReason },
          ],
        };

        return nextPlan;
      }

      const nextPlan = {
        ...currentPlan,
        attwPackages: [...currentPlan.attwPackages, packageInfo],
        publintPackages: [...currentPlan.publintPackages, packageInfo],
      };

      return nextPlan;
    },
    initialPlan,
  );

  return result;
};

const runPublint = (
  packageInfo: WorkspacePackage,
  runCommand: ExecuteBufferedShellCommand,
) => {
  const result = runCommand({
    args: [`bunx`, `publint`, `run`, `.`, `--pack`, `false`, `--strict`],
    cwd: packageInfo.directory,
    label: `publint ${packageInfo.name} (${packageInfo.relativeDirectory})`,
    printSuccessOutput: false,
  });

  return result;
};

const runAttw = (
  packageInfo: WorkspacePackage,
  runCommand: ExecuteBufferedShellCommand,
) => {
  const result = runCommand({
    args: [
      `bunx`,
      `attw`,
      `.`,
      `--pack`,
      `--format`,
      `table`,
      `--profile`,
      `esm-only`,
      `--quiet`,
      `--ignore-rules`,
      `no-resolution`,
      `internal-resolution-error`,
    ],
    cwd: packageInfo.directory,
    label: `attw ${packageInfo.name} (${packageInfo.relativeDirectory})`,
    printSuccessOutput: false,
  });

  return result;
};

const printSkippedPackages = (
  heading: string,
  skippedPackages: readonly SkippedPackageInfo[],
) => {
  console.log(`\n${heading}: ${skippedPackages.length}`);

  skippedPackages.forEach((skippedPackage) => {
    const { packageInfo, reason } = skippedPackage;

    console.log(`- ${packageInfo.name}: ${reason}`);
  });
};
type PrintPackageExportProgressProps = JobCompletion;

const printPackageExportProgress = (props: PrintPackageExportProgressProps) => {
  const { completedJobCount, jobCount, jobResult } = props;
  const shouldPrintProgress =
    completedJobCount === jobCount ||
    completedJobCount % PACKAGE_EXPORT_PROGRESS_INTERVAL === 0;

  if (jobResult.exitCode !== 0) {
    console.log(`Package export check failed: ${jobResult.label}`);
  }

  if (shouldPrintProgress) {
    console.log(`Package export checks: ${completedJobCount}/${jobCount}`);
  }
};

const createPublintJob = (
  packageInfo: WorkspacePackage,
  runCommand: ExecuteBufferedShellCommand,
) => {
  const label = `publint ${packageInfo.name} (${packageInfo.relativeDirectory})`;
  const result: Job = {
    label,
    run: async () => {
      const commandResult = await runPublint(packageInfo, runCommand);
      return commandResult.exitCode;
    },
  };

  return result;
};

const createAttwJob = (
  packageInfo: WorkspacePackage,
  runCommand: ExecuteBufferedShellCommand,
) => {
  const label = `attw ${packageInfo.name} (${packageInfo.relativeDirectory})`;
  const result: Job = {
    label,
    run: async () => {
      const commandResult = await runAttw(packageInfo, runCommand);
      return commandResult.exitCode;
    },
  };

  return result;
};

const verifyPlannedPackageExports = async (
  packageInfos: readonly WorkspacePackage[],
  runCommand: ExecuteBufferedShellCommand,
) => {
  const { attwPackages, publintPackages, skippedPackages } =
    createPackageExportPlan(packageInfos);

  console.log(`Package exports plan`);
  console.log(`- publint packages: ${publintPackages.length}`);
  console.log(`- attw packages: ${attwPackages.length}`);
  printSkippedPackages(
    `Packages excluded from package export checks`,
    skippedPackages,
  );

  const publintJobs = publintPackages.map((packageInfo) =>
    createPublintJob(packageInfo, runCommand),
  );
  const attwJobs = attwPackages.map((packageInfo) =>
    createAttwJob(packageInfo, runCommand),
  );
  const jobs = [...publintJobs, ...attwJobs];
  const jobsResult = await runJobs({
    concurrency: DEFAULT_REPO_JOB_CONCURRENCY,
    jobs,
    onJobComplete: printPackageExportProgress,
  });
  const { exitCode } = jobsResult;

  return exitCode;
};
export type VerifyPackageExportsProps = {
  readonly cwd: string;
  readonly filePaths: readonly string[];
};

export const verifyPackageExports = async (
  props: VerifyPackageExportsProps,
  options: VerifyPackageExportsOptions = {},
) => {
  const { cwd, filePaths: rawFilePaths } = props;
  const { runCommand = executeBufferedShellCommand } = options;
  const repoRoot = await resolveWorkspaceRepoRoot({ cwd });

  if (repoRoot === null) {
    const result = createWorkflowResult({ exitCode: 1 });
    return result;
  }

  const allPackageInfos = readWorkspacePackages({ repoRoot });
  const shouldRunFullWorkflow = checkShouldRunFullWorkflow(rawFilePaths);
  const filePaths = normalizeFilePaths({
    cwd,
    repoRoot,
    filePaths: rawFilePaths,
  });
  const affectedPackages = resolveAffectedPackages({
    filePaths,
    packageInfos: allPackageInfos,
  });
  const runnablePackages = filterRunnablePackages(affectedPackages);
  const packageInfos = shouldRunFullWorkflow
    ? allPackageInfos
    : runnablePackages;

  if (shouldRunFullWorkflow === false && packageInfos.length === 0) {
    console.log(`\nNo staged workspaces matched package export inputs.`);

    const result = createWorkflowResult({ exitCode: 0 });
    return result;
  }

  const exitCode = await verifyPlannedPackageExports(packageInfos, runCommand);
  const result = createWorkflowResult({ exitCode });

  return result;
};
