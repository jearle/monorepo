import { test, expect } from 'bun:test';

import { toSnakeCaseProps } from './to-snake-case-props';

test(`toSnakeCaseProps(validObject)`, () => {
  const snakeCasedObject = toSnakeCaseProps<{ readonly camel_case: string }>({
    camelCase: `hello`,
  });

  if (snakeCasedObject === null) {
    expect(snakeCasedObject).toBeDefined();

    return;
  }

  expect(snakeCasedObject.camel_case).toBe(`hello`);
});
