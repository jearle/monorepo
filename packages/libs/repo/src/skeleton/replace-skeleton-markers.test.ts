import { expect, test } from 'bun:test';

import {
  SKELETON_RESULT_STATUS_SUCCESS,
  createPackageNameParts,
  replaceSkeletonMarkers,
} from '.';

test(`replaceSkeletonMarkers({ value, nameParts }) replaces skeleton markers`, () => {
  const namePartsResult = createPackageNameParts({
    name: `behavior-datasets`,
  });

  if (namePartsResult.status !== SKELETON_RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  const { nameParts } = namePartsResult.data;

  const value = [
    `@jearle/cli-__skeleton`,
    `COMMAND___SKELETON_HEALTH`,
    `Create__skeletonProps`,
    `Create__skeletonResult`,
    `create__skeletonHealthCommand`,
    `__skeletonCommandContext`,
    `__skeletonHealthCommand`,
    `__skeletonCommand`,
    `__skeletonResult`,
    `__Skeleton`,
    `__SKELETON`,
    `__skeleton`,
  ].join(`\n`);
  const result = replaceSkeletonMarkers({ value, nameParts });

  expect(result).toBe(
    [
      `@jearle/cli-behavior-datasets`,
      `COMMAND_BEHAVIOR_DATASETS_HEALTH`,
      `CreateBehaviorDatasetsProps`,
      `CreateBehaviorDatasetsResult`,
      `createBehaviorDatasetsHealthCommand`,
      `BehaviorDatasetsCommandContext`,
      `behaviorDatasetsHealthCommand`,
      `behaviorDatasetsCommand`,
      `behaviorDatasetsResult`,
      `BehaviorDatasets`,
      `BEHAVIOR_DATASETS`,
      `behavior-datasets`,
    ].join(`\n`),
  );
});
