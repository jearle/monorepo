import { expect, test } from 'bun:test';

import { SKELETON_RESULT_STATUS_SUCCESS, createPackageNameParts } from '.';

test(`createPackageNameParts({ name }) derives name formats`, () => {
  const result = createPackageNameParts({
    name: `behavior-datasets`,
  });

  expect(result.status).toBe(SKELETON_RESULT_STATUS_SUCCESS);

  if (result.status !== SKELETON_RESULT_STATUS_SUCCESS) {
    expect.unreachable();
  }

  const { nameParts } = result.data;

  expect(nameParts).toEqual({
    kebab: `behavior-datasets`,
    camel: `behaviorDatasets`,
    pascal: `BehaviorDatasets`,
    constant: `BEHAVIOR_DATASETS`,
  });
});
