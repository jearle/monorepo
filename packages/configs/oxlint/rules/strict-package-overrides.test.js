import { expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';

const configPath = new URL(`../.oxlintrc.json`, import.meta.url);

test(`util-template enables strict inspectability rule options`, async () => {
  const content = await readFile(configPath, `utf8`);
  const config = JSON.parse(content);
  const override = config.overrides.find(({ files }) => {
    const result = files.includes(`packages/utils/template/**/*.{ts,tsx}`);

    return result;
  });

  expect(override?.rules).toMatchObject({
    [`monorepo-conventions/no-object-mutation`]: [
      `error`,
      {
        allowCurrentPropertyAssignment: true,
        requireObjectMutationApiChecks: true,
      },
    ],
    [`monorepo-conventions/prefer-check-predicate-names`]: [
      `error`,
      { requireBooleanValueNames: true },
    ],
    [`monorepo-conventions/require-function-parameter-conventions`]: [
      `error`,
      {
        requireContextOperationShape: true,
        requireNamedPropsTypeReference: true,
      },
    ],
    [`monorepo-conventions/require-result-variable-return`]: [
      `error`,
      { requireAllNonTrivialReturns: true },
    ],
  });
});
