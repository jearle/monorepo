# Testing

Test public behavior through package and feature entrypoints.

## Public API

- Test only public APIs exported from `index.ts`.
- Public surface tests import the local feature entrypoint from `.`, not `./`,
  `./index`, or implementation files.
- Do not test internal implementation details.
- Do not mock internal modules.
- Use real local/package dependencies.
- Place `feature.test.ts` next to `feature.ts`.

```ts
import { expect, test } from 'bun:test';

import { round } from '.';

test(`rounds to nearest integer`, () => {
  const result = round({ value: 4.6 });

  expect(result).toBe(5);
});
```

## Test Scope

- Keep tests focused for narrow changes.
- Broaden coverage when changes touch shared behavior, cross-module contracts, or user-facing workflows.
- App and composition tests verify composition, routing, and dependency wiring. They do not retest downstream package business behavior.
- CLI tests may assert output shape when output formatting is the CLI contract.
- CLI tests should not retest lower-level utility transformations that already have package-level coverage.
- Do not hide core contract tests behind ad hoc environment flags.
- Avoid real network calls and uncontrolled filesystem state unless the test is intentionally integration-level.

## Type Tests

- Use `@ts-expect-error` for intentional type errors.
- Add a colon and description after `@ts-expect-error`, for example
  `@ts-expect-error: value must be a number`.
- Do not use `@ts-ignore`.

```ts
// @ts-expect-error: value must be a number
round({ value: `4.6` });
```

## Semantic Review

The following testing conventions require reviewer judgment and are not encoded
as deterministic lint rules:

- Whether a test is scoped narrowly enough for the change.
- Whether an app or composition test is retesting downstream business behavior.
- Whether a network or filesystem dependency is intentionally integration-level.
