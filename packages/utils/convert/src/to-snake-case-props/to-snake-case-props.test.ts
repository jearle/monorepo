import { expect, test } from 'bun:test';

import { toSnakeCaseProps } from '.';

test(`toSnakeCaseProps(validObject)`, () => {
  type SnakeCasedObjectShape = { readonly camel_case: string };

  const snakeCasedObject = toSnakeCaseProps<SnakeCasedObjectShape>({
    camelCase: `hello`,
  });

  if (snakeCasedObject === null) {
    expect(snakeCasedObject).toBeDefined();

    return;
  }

  expect(snakeCasedObject.camel_case).toBe(`hello`);
});
