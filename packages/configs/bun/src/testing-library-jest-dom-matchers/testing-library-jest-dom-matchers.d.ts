import { type TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'bun:test' {
  /* oxlint-disable-next-line typescript/no-empty-object-type */
  interface Matchers<T> extends TestingLibraryMatchers<
    typeof expect.stringContaining,
    T
  > {}

  /* oxlint-disable-next-line typescript/no-empty-object-type */
  interface AsymmetricMatchers extends TestingLibraryMatchers<
    unknown,
    unknown
  > {}
}
