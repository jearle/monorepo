import { afterEach, expect } from 'bun:test';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
// import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

// declare module "bun:test" {
//   interface Matchers<T>
//     extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}

//   interface AsymmetricMatchers
//     extends TestingLibraryMatchers<unknown, unknown> {}
// }

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
