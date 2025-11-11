import { test, expect } from 'bun:test';
import { safeStringify } from './safe-stringify';

test('safeStringify(object)', () => {
  const result = safeStringify({ hello: 'world' });

  if (!result.success) {
    console.error(result.error);
    expect(result.success).toBeTrue();
    return;
  }

  expect(result.data).toBeString();
  expect(result.data).toContain('hello');
});

test('safeStringify(object, space)', () => {
  const result = safeStringify({ hello: 'world' }, '  ');

  if (!result.success) {
    console.error(result.error);
    expect(result.success).toBeTrue();
    return;
  }

  expect(result.data).toMatch(/\n/);
});

test('safeStringify(array)', () => {
  const result = safeStringify([1, 2, 3]);

  if (!result.success) {
    console.error(result.error);
    expect(result.success).toBeTrue();
    return;
  }

  expect(result.data).toBeString();
  expect(result.data).toContain('1');
});

test('safeStringify(primitive)', () => {
  const result = safeStringify(42);

  expect(result.success).toBeFalse();
  if (!result.success) {
    expect(result.error).toBeInstanceOf(Error);
  }
});

test('safeStringify(null)', () => {
  const result = safeStringify(null);

  expect(result.success).toBeFalse();
  if (!result.success) {
    expect(result.error.message).toMatch(/objects and arrays/);
  }
});

test('safeStringify(undefined)', () => {
  const result = safeStringify(undefined);

  expect(result.success).toBeFalse();
  if (!result.success) {
    expect(result.error.message).toMatch(/objects and arrays/);
  }
});
