import { expect, test } from 'bun:test';

import { safeStringify } from '.';

test(`safeStringify(object)`, () => {
  const result = safeStringify({ hello: `world` });

  if (!result.success) {
    console.error(result.error);
    expect(result.success).toBeTrue();
    return;
  }

  expect(result.data).toBeString();
  expect(result.data).toContain(`hello`);
});

test(`safeStringify(object, space)`, () => {
  const result = safeStringify({ hello: `world` }, `  `);

  if (!result.success) {
    console.error(result.error);
    expect(result.success).toBeTrue();
    return;
  }

  expect(result.data).toMatch(/\n/);
});

test(`safeStringify(array)`, () => {
  const result = safeStringify([1, 2, 3]);

  if (!result.success) {
    console.error(result.error);
    expect(result.success).toBeTrue();
    return;
  }

  expect(result.data).toBeString();
  expect(result.data).toContain(`1`);
});

test(`safeStringify(number)`, () => {
  const result = safeStringify(42);

  expect(result.success).toBeTrue();
  if (result.success) {
    expect(result.data).toBe(`42`);
  }
});

test(`safeStringify(string)`, () => {
  const result = safeStringify(`hello`);

  expect(result.success).toBeTrue();
  if (result.success) {
    expect(result.data).toBe(`"hello"`);
  }
});

test(`safeStringify(boolean)`, () => {
  const result = safeStringify(true);

  expect(result.success).toBeTrue();
  if (result.success) {
    expect(result.data).toBe(`true`);
  }
});

test(`safeStringify(null)`, () => {
  const result = safeStringify(null);

  expect(result.success).toBeTrue();
  if (result.success) {
    expect(result.data).toBe(`null`);
  }
});

test(`safeStringify(undefined)`, () => {
  const result = safeStringify(undefined);

  expect(result.success).toBeFalse();
  if (!result.success) {
    expect(result.error).toBeInstanceOf(Error);
  }
});

test(`safeStringify(function)`, () => {
  const result = safeStringify(() => undefined);

  expect(result.success).toBeFalse();
  if (!result.success) {
    expect(result.error).toBeInstanceOf(Error);
  }
});

test(`safeStringify(symbol)`, () => {
  const result = safeStringify(Symbol(`value`));

  expect(result.success).toBeFalse();
  if (!result.success) {
    expect(result.error).toBeInstanceOf(Error);
  }
});

test(`safeStringify handles thrown values with failing string conversion`, () => {
  const thrownValue = {
    toString: () => {
      throw new Error(`toString failed`);
    },
  };
  const value = {
    toJSON: () => {
      throw thrownValue;
    },
  };
  const result = safeStringify(value);

  expect(result.success).toBeFalse();
  if (!result.success) {
    expect(result.error.message).toBe(`Unknown JSON stringify error`);
  }
});
