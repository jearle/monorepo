import { type HandlerArgs, defineCommand, option } from '@bunli/core';
import {
  PATHS_RESULT_STATUS_ERROR,
  SKELETON_RESULT_STATUS_ERROR,
  createSkeletonPackage,
  findRepoRoot,
} from '@jearle/lib-repo';
import { setCLIFailureExitCode } from '@jearle/util-cli';
import { z } from 'zod';

import {
  COMMAND_REPO_SKELETON,
  COMMAND_REPO_SKELETON_DESCRIPTION,
  OPTION_REPO_SKELETON_NAME_DESCRIPTION,
  OPTION_REPO_SKELETON_PACKAGES_DESCRIPTION,
  OPTION_REPO_SKELETON_TEMPLATE_DESCRIPTION,
} from '../constants';
type HandlerPropsHandlerArgs = {
  readonly name: string;
  readonly packages: string;
  readonly template: string | undefined;
};

type HandlerProps = HandlerArgs<HandlerPropsHandlerArgs>;

export const createSkeletonCommand = () => {
  const skeletonCommand = defineCommand({
    name: COMMAND_REPO_SKELETON,
    description: COMMAND_REPO_SKELETON_DESCRIPTION,
    options: {
      packages: option(z.string().min(1), {
        description: OPTION_REPO_SKELETON_PACKAGES_DESCRIPTION,
      }),
      template: option(z.string().min(1).optional(), {
        description: OPTION_REPO_SKELETON_TEMPLATE_DESCRIPTION,
      }),
      name: option(z.string().min(1), {
        description: OPTION_REPO_SKELETON_NAME_DESCRIPTION,
      }),
    },
    handler: async (props: HandlerProps) => {
      const { cwd, flags } = props;
      const { name, packages: packageFamily, template } = flags;
      const findRepoRootResult = await findRepoRoot({ startPath: cwd });
      const findRepoRootHasFailure =
        findRepoRootResult.status === PATHS_RESULT_STATUS_ERROR;

      if (findRepoRootHasFailure) {
        const { error } = findRepoRootResult;

        console.error(error.message);
        setCLIFailureExitCode();
        return;
      }

      const { repoRoot } = findRepoRootResult.data;
      const createSkeletonPackageResult = await createSkeletonPackage({
        repoRoot,
        packageFamily,
        template,
        name,
      });
      const createSkeletonPackageHasFailure =
        createSkeletonPackageResult.status === SKELETON_RESULT_STATUS_ERROR;

      if (createSkeletonPackageHasFailure) {
        const { error } = createSkeletonPackageResult;

        console.error(error.message);
        setCLIFailureExitCode();
        return;
      }

      const { skeletonPackage } = createSkeletonPackageResult.data;
      const { relativeTargetPath } = skeletonPackage;

      console.log(`created ${relativeTargetPath}`);
    },
  });

  const result = { skeletonCommand };
  return result;
};
