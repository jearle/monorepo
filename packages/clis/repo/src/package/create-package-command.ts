import { type HandlerArgs, defineCommand, defineGroup } from '@bunli/core';
import {
  compilePackage,
  formatPackage,
  lintPackage,
  lintStylePackage,
  testPackage,
  verifyPackage,
} from '@jearle/lib-repo';
import { setCLIFailureExitCode } from '@jearle/util-cli';

import {
  COMMAND_REPO_PACKAGE,
  COMMAND_REPO_PACKAGE_COMPILE,
  COMMAND_REPO_PACKAGE_COMPILE_DESCRIPTION,
  COMMAND_REPO_PACKAGE_DESCRIPTION,
  COMMAND_REPO_PACKAGE_FORMAT,
  COMMAND_REPO_PACKAGE_FORMAT_DESCRIPTION,
  COMMAND_REPO_PACKAGE_LINT,
  COMMAND_REPO_PACKAGE_LINT_DESCRIPTION,
  COMMAND_REPO_PACKAGE_LINT_STYLE,
  COMMAND_REPO_PACKAGE_LINT_STYLE_DESCRIPTION,
  COMMAND_REPO_PACKAGE_TEST,
  COMMAND_REPO_PACKAGE_TEST_DESCRIPTION,
  COMMAND_REPO_PACKAGE_VERIFY,
  COMMAND_REPO_PACKAGE_VERIFY_DESCRIPTION,
} from '../constants';

const setExitCodeOnFailure = (exitCode: number) => {
  if (exitCode !== 0) {
    setCLIFailureExitCode();
  }
};

type HandlerProps = HandlerArgs;

export const createPackageCommand = () => {
  const compileCommand = defineCommand({
    name: COMMAND_REPO_PACKAGE_COMPILE,
    description: COMMAND_REPO_PACKAGE_COMPILE_DESCRIPTION,
    handler: async (props: HandlerProps) => {
      const { cwd } = props;
      const result = await compilePackage({ cwd });

      setExitCodeOnFailure(result.exitCode);
    },
  });
  const formatCommand = defineCommand({
    name: COMMAND_REPO_PACKAGE_FORMAT,
    description: COMMAND_REPO_PACKAGE_FORMAT_DESCRIPTION,
    handler: async (props: HandlerProps) => {
      const { cwd } = props;
      const result = await formatPackage({ cwd });

      setExitCodeOnFailure(result.exitCode);
    },
  });
  const lintCommand = defineCommand({
    name: COMMAND_REPO_PACKAGE_LINT,
    description: COMMAND_REPO_PACKAGE_LINT_DESCRIPTION,
    handler: async (props: HandlerProps) => {
      const { cwd } = props;
      const result = await lintPackage({ cwd });

      setExitCodeOnFailure(result.exitCode);
    },
  });
  const lintStyleCommand = defineCommand({
    name: COMMAND_REPO_PACKAGE_LINT_STYLE,
    description: COMMAND_REPO_PACKAGE_LINT_STYLE_DESCRIPTION,
    handler: async (props: HandlerProps) => {
      const { cwd } = props;
      const result = await lintStylePackage({ cwd });

      setExitCodeOnFailure(result.exitCode);
    },
  });
  const testCommand = defineCommand({
    name: COMMAND_REPO_PACKAGE_TEST,
    description: COMMAND_REPO_PACKAGE_TEST_DESCRIPTION,
    handler: async (props: HandlerProps) => {
      const { cwd } = props;
      const result = await testPackage({ cwd });

      setExitCodeOnFailure(result.exitCode);
    },
  });
  const verifyCommand = defineCommand({
    name: COMMAND_REPO_PACKAGE_VERIFY,
    description: COMMAND_REPO_PACKAGE_VERIFY_DESCRIPTION,
    handler: async (props: HandlerProps) => {
      const { cwd } = props;
      const result = await verifyPackage({ cwd });

      setExitCodeOnFailure(result.exitCode);
    },
  });
  const packageCommand = defineGroup({
    name: COMMAND_REPO_PACKAGE,
    description: COMMAND_REPO_PACKAGE_DESCRIPTION,
    commands: [
      compileCommand,
      formatCommand,
      lintCommand,
      lintStyleCommand,
      testCommand,
      verifyCommand,
    ],
  });
  const result = { packageCommand };

  return result;
};
