import { test, expect } from 'bun:test';

import { toCamelCaseProps } from './to-camel-case-props';

test(`toCamelCaseProps(validObject)`, () => {
  const camelCasedObject = toCamelCaseProps<{ readonly snakeCase: string }>({
    snake_case: `hello`,
  });

  if (camelCasedObject === null) {
    expect(camelCasedObject).toBeDefined();

    return;
  }

  expect(camelCasedObject.snakeCase).toBe(`hello`);
});
