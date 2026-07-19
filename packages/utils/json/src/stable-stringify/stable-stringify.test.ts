import { expect, test } from 'bun:test';

import { stableStringify } from '.';

test(`stableStringify orders nested object keys`, () => {
  const result = stableStringify({
    zebra: true,
    alpha: {
      delta: 4,
      beta: 2,
    },
    items: [
      {
        y: 2,
        x: 1,
      },
    ],
  });

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.data).toBe(
    `{"alpha":{"beta":2,"delta":4},"items":[{"x":1,"y":2}],"zebra":true}`,
  );
});

test(`stableStringify preserves array order`, () => {
  const result = stableStringify([
    { z: 1, a: 2 },
    { y: 3, b: 4 },
  ]);

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.data).toBe(`[{"a":2,"z":1},{"b":4,"y":3}]`);
});

test(`stableStringify reports unsupported root values`, () => {
  const result = stableStringify(undefined);

  expect(result.success).toBeFalse();

  if (result.success === true) {
    expect.unreachable();
  }

  expect(result.error.message).toContain(`not JSON serializable`);
});

test(`stableStringify reports circular objects`, () => {
  const value: Record<string, unknown> = {};

  value[`self`] = value;

  const result = stableStringify(value);

  expect(result.success).toBeFalse();

  if (result.success === true) {
    expect.unreachable();
  }

  expect(result.error.message.length).toBeGreaterThan(0);
});

test(`stableStringify preserves JSON.stringify-compatible toJSON behavior`, () => {
  const value = {
    child: {
      toJSON: (key: string) => ({
        zebra: 2,
        key,
        alpha: 1,
      }),
    },
    date: new Date(0),
  };
  const result = stableStringify(value);

  expect(result.success).toBeTrue();

  if (result.success === false) {
    expect.unreachable();
  }

  expect(result.data).toBe(
    `{"child":{"alpha":1,"key":"child","zebra":2},"date":"1970-01-01T00:00:00.000Z"}`,
  );
});

test(`stableStringify returns failures for thrown non-errors`, () => {
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
  const result = stableStringify(value);

  expect(result.success).toBeFalse();

  if (result.success === true) {
    expect.unreachable();
  }

  expect(result.error.message).toBe(`Unknown JSON stringify error`);
});
