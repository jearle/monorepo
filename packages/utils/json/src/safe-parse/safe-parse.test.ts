import { test, expect } from 'bun:test';

import { safeParse } from './safe-parse';

type FooBar = { readonly foo: `bar` };

const VALID_JSON = `{"foo": "bar"}`;
const INVALID_JSON = `{foo: "bar"}`;

test(`safeParse(validJSON)`, () => {
  const value = VALID_JSON;

  const parsed = safeParse<FooBar>(value);
  const { success } = parsed;

  expect(success).toBeTrue();

  if (success === false) {
    return;
  }

  const { data } = parsed;

  const { foo } = data;

  expect(foo).toBe(`bar`);
});

test(`safeParse(invalidJSON)`, () => {
  const value = INVALID_JSON;

  const parsed = safeParse<FooBar>(value);
  const { success } = parsed;

  expect(success).toBeFalse();

  if (success === true) {
    return;
  }

  const { error } = parsed;

  expect(error.message).toBeTypeOf(`string`);
});
