import { executeShellCommand } from '../shell-command';
import { checkIsArchivedPackage } from '../workspace';
import { createWorkflowResult } from '../workflow-result';
import { checkHasPackageTestFile } from './check-has-package-test-file';
import { resolvePackageWorkflowContext } from './resolve-package-workflow-context';
import { type PackageWorkflowProps, type TestPackageOptions } from './types';

const packageTestEnvArgs = [
  `DATABASE_URL=postgres://monorepo:monorepo@localhost:5432/monorepo_test`,
  `COOKIE_SECRET=monorepo-test-cookie-secret`,
  `EMBEDDING_BACKEND=local_hugging_face`,
  `HOSTNAME=127.0.0.1`,
  `JWT_SECRET=monorepo-test-secret`,
  `LOG_LEVEL=info`,
  `NODE_ENV=test`,
  `OPENROUTER_API=https://openrouter.ai/api/v1`,
  `OPENROUTER_API_KEY=monorepo-test-key`,
  `OPENROUTER_EMBEDDINGS_MODEL=openai/text-embedding-3-small`,
  `OPENROUTER_MODEL=openai/gpt-4o-mini`,
  `PORT=3000`,
];

const unitTestArgs = [
  `--pass-with-no-tests`,
  `--path-ignore-patterns=**/*.e2e.test.ts`,
  `--path-ignore-patterns=**/*.e2e.test.tsx`,
  `--path-ignore-patterns=**/*.integration.test.ts`,
  `--path-ignore-patterns=**/*.integration.test.tsx`,
  `--path-ignore-patterns=**/e2e/**`,
];
export type TestPackageProps = PackageWorkflowProps;

export const testPackage = async (
  props: TestPackageProps,
  options: TestPackageOptions = {},
) => {
  const { cwd } = props;
  const { runCommand = executeShellCommand } = options;
  const context = await resolvePackageWorkflowContext({ cwd });

  if (context === null) {
    const result = createWorkflowResult({ exitCode: 1 });
    return result;
  }

  const { packageInfo } = context;
  const isArchivedPackage = checkIsArchivedPackage(packageInfo);

  if (isArchivedPackage) {
    console.log(`\nSkipping archived package ${packageInfo.name}.`);

    const result = createWorkflowResult({ exitCode: 0 });
    return result;
  }

  const hasPackageTestFile = checkHasPackageTestFile({ packageInfo });

  if (hasPackageTestFile === false) {
    console.log(`\nNo test files found for ${packageInfo.name}.`);

    const result = createWorkflowResult({ exitCode: 0 });
    return result;
  }

  const exitCode = runCommand({
    args: [`env`, ...packageTestEnvArgs, `bun`, `test`, ...unitTestArgs],
    cwd: packageInfo.directory,
  });
  const result = createWorkflowResult({ exitCode });

  return result;
};
