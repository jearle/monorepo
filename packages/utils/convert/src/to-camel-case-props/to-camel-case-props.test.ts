import { expect, test } from 'bun:test';

import { toCamelCaseProps } from '.';

test(`toCamelCaseProps(validObject)`, () => {
  type CamelCasedObjectShape = { readonly snakeCase: string };

  const camelCasedObject = toCamelCaseProps<CamelCasedObjectShape>({
    snake_case: `hello`,
  });

  if (camelCasedObject === null) {
    expect(camelCasedObject).toBeDefined();

    return;
  }

  expect(camelCasedObject.snakeCase).toBe(`hello`);
});
