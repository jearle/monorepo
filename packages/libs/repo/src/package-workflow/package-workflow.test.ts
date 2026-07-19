import path from 'node:path';

import { expect, test } from 'bun:test';

import { PATHS_RESULT_STATUS_ERROR, findRepoRoot } from '../paths';
import {
  compilePackage,
  lintPackage,
  lintStylePackage,
  testPackage as runTestPackage,
  verifyPackage,
} from '.';

type CapturedCommand = {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly label?: string;
};

const resolveTestRepoRoot = async () => {
  const findRepoRootResult = await findRepoRoot({ startPath: process.cwd() });
  const hasError = findRepoRootResult.status === PATHS_RESULT_STATUS_ERROR;

  if (hasError) {
    const { error } = findRepoRootResult;

    throw error;
  }

  const { repoRoot } = findRepoRootResult.data;
  return repoRoot;
};

const createCommandCapture = () => {
  const commands: CapturedCommand[] = [];
  type RunCommandProps = CapturedCommand;

  const runCommand = (props: RunCommandProps) => {
    const { args, cwd, label } = props;

    commands.push({ args, cwd, label });
    return 0;
  };
  const result = { commands, runCommand };

  return result;
};

const expectNoTurboCommands = (commands: readonly CapturedCommand[]) => {
  const hasTurboCommand = commands.some((command) =>
    command.args.includes(`turbo`),
  );

  expect(hasTurboCommand).toBe(false);
};

test(`runs package compile directly without Turbo`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const packageDirectory = path.join(repoRoot, `packages/libs/repo`);
  const { commands, runCommand } = createCommandCapture();
  const result = await compilePackage(
    { cwd: packageDirectory },
    { runCommand },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([
    {
      args: [`tsc`, `-b`],
      cwd: packageDirectory,
    },
  ]);
  expectNoTurboCommands(commands);
});

test(`skips package compile when the package has no source directory`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const packageDirectory = path.join(repoRoot, `packages/configs/tsconfig`);
  const { commands, runCommand } = createCommandCapture();
  const result = await compilePackage(
    { cwd: packageDirectory },
    { runCommand },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([]);
});

test(`runs package lint directly with the repo Oxlint config`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const packageDirectory = path.join(repoRoot, `packages/configs/oxlint`);
  const { commands, runCommand } = createCommandCapture();
  const result = await lintPackage({ cwd: packageDirectory }, { runCommand });

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([
    {
      args: [
        `oxlint`,
        `packages/configs/oxlint`,
        `--config`,
        `packages/configs/oxlint/.oxlintrc.json`,
        `--no-error-on-unmatched-pattern`,
      ],
      cwd: repoRoot,
    },
  ]);
  expectNoTurboCommands(commands);
});

test(`runs package style lint directly without Turbo`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const packageDirectory = path.join(repoRoot, `packages/uis/core`);
  const { commands, runCommand } = createCommandCapture();
  const result = await lintStylePackage(
    { cwd: packageDirectory },
    { runCommand },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([
    {
      args: [
        `stylelint`,
        `src/**/*.css`,
        `src/**/*.scss`,
        `--allow-empty-input`,
      ],
      cwd: packageDirectory,
    },
  ]);
  expectNoTurboCommands(commands);
});

test(`skips package style lint when the package has no style files`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const packageDirectory = path.join(repoRoot, `packages/utils/array`);
  const { commands, runCommand } = createCommandCapture();
  const result = await lintStylePackage(
    { cwd: packageDirectory },
    { runCommand },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([]);
});

test(`skips package test when the package has no test files`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const packageDirectory = path.join(repoRoot, `packages/utils/types`);
  const { commands, runCommand } = createCommandCapture();
  const result = await runTestPackage(
    { cwd: packageDirectory },
    { runCommand },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([]);
});

test(`runs package test directly when test files exist`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const packageDirectory = path.join(repoRoot, `packages/utils/array`);
  const { commands, runCommand } = createCommandCapture();
  const result = await runTestPackage(
    { cwd: packageDirectory },
    { runCommand },
  );

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([
    {
      args: [
        `env`,
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
        `bun`,
        `test`,
        `--pass-with-no-tests`,
        `--path-ignore-patterns=**/*.e2e.test.ts`,
        `--path-ignore-patterns=**/*.e2e.test.tsx`,
        `--path-ignore-patterns=**/*.integration.test.ts`,
        `--path-ignore-patterns=**/*.integration.test.tsx`,
        `--path-ignore-patterns=**/e2e/**`,
      ],
      cwd: packageDirectory,
    },
  ]);
  expectNoTurboCommands(commands);
});

test(`runs package verify as direct package tasks`, async () => {
  const repoRoot = await resolveTestRepoRoot();
  const packageDirectory = path.join(repoRoot, `packages/utils/array`);
  const { commands, runCommand } = createCommandCapture();
  const result = await verifyPackage({ cwd: packageDirectory }, { runCommand });

  expect(result.exitCode).toBe(0);
  expect(commands).toEqual([
    {
      args: [
        `oxlint`,
        `packages/utils/array`,
        `--config`,
        `packages/configs/oxlint/.oxlintrc.json`,
        `--no-error-on-unmatched-pattern`,
      ],
      cwd: repoRoot,
    },
    {
      args: [`tsc`, `-b`],
      cwd: packageDirectory,
    },
    {
      args: [
        `env`,
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
        `bun`,
        `test`,
        `--pass-with-no-tests`,
        `--path-ignore-patterns=**/*.e2e.test.ts`,
        `--path-ignore-patterns=**/*.e2e.test.tsx`,
        `--path-ignore-patterns=**/*.integration.test.ts`,
        `--path-ignore-patterns=**/*.integration.test.tsx`,
        `--path-ignore-patterns=**/e2e/**`,
      ],
      cwd: packageDirectory,
    },
  ]);
  expectNoTurboCommands(commands);
});
