# TypeScript

Use `const` arrow functions, named intermediate values, and immutable data.

## Function Shape

- Exported functions use inline `export const`.
- Object-shaped required inputs use a single `props` object.
- Every property in a props type is `readonly`.
- Function-specific input types use suffix names such as `CreateThingProps`.
- Named functions with a `props` parameter annotate it with the function-owned
  named props type, such as `CreateThingProps`. Do this for public functions,
  private helpers, and test helpers.
- Public function props types are exported and placed immediately above their
  owning public function.
- Private function props types are placed immediately above their owning
  private function.
- Any local type referenced by an exported type, public props type, public
  result type, or exported function signature is part of the public API and must
  be exported too.
- Exported result types use suffix names such as `CreateThingResult`.
- Shared dependency contexts use suffix names such as `ThingContext`.
- Optional call modifiers use suffix names such as `ThingOptions`.
- Resolved, normalized, defaulted, or internal option shapes still use an
  `Options` suffix when they are passed through an `options` parameter or
  `options` props property.
- Type guards accept one raw value directly instead of a props object.
- Zero-input functions take no argument.
- Let TypeScript infer return types, except type predicates and public named result types callers need.
- Exported functions that return a named structured result annotate the return
  with the exported `...Result` type.

```ts
type UpdateUserProps = {
  readonly id: string;
  readonly data: User;
};

export const updateUser = (props: UpdateUserProps) => {
  const { id, data } = props;
  const result = applyUserUpdate({ id, data });
  return result;
};
```

## Predicate Names

Predicate and type guard functions use `check...` names so boolean values can
use direct state names without shadowing the predicate. This applies to every
predicate function, including one-off local helpers, not only reusable ones.

- Use `checkIsThing`, `checkHasThing`, `checkCanThing`, or `checkShouldThing`
  for predicate functions.
- Use `isThing`, `hasThing`, `canThing`, or `shouldThing` for boolean values.
- Do not use `isThing`, `hasThing`, `canThing`, or `shouldThing` as predicate
  function names.

```ts
const isCSVExportInput = checkIsCSVExportInput(value);

if (isCSVExportInput === false) {
  return false;
}
```

## String Literals

- Normal string literals use backticks by default.
- Object keys that need string-literal syntax use computed backtick keys.
- Static import and export module specifiers use single quotes.
- Directive literals such as `'use client'` and `'use strict'` use single quotes because backticks do not create directive prologues.
- `declare module 'package-name'` specifiers use single quotes.
- Type member keys that require quoted property names use single quotes because backticks are not valid property-name syntax there.

```ts
import { createUser } from './create-user';

const status = `active`;
const message = `Created user ${userId}`;

const command = {
  [`template-file`]: option(z.string().min(1)),
};
```

## Imports And Re-Exports

- Relative imports between TypeScript source files use extensionless paths.
- Current-directory feature entrypoint imports use `.`.
- Sibling and parent feature entrypoint imports use the directory path.
- Type-only named imports use inline `type` specifiers.
- Type-only named re-exports use inline `type` specifiers.
- Do not use top-level named `import type` declarations.
- Do not use top-level named `export type` declarations.
- Named import and re-export specifiers are ordered by category: inline `type`
  specifiers, all-caps constants, then other values.
- Alphabetize named import and re-export specifiers within each category by
  imported source name.
- Do not add blank lines between categories inside a named import or re-export
  specifier list.

```ts
import {
  type AlphaThing,
  type Thing,
  CONSTANT_ALPHA,
  CONSTANT_THING,
  anotherThing,
  otherThing,
} from 'thing';
import { createThing } from '.';
import { createEnv } from '../env';
import { type Logger, type LoggerOptions, createLogger } from './logger';
export { type LoggerOptions, createLogger } from './logger';
```

## One Line, One Operation

- Avoid nested function calls when they hide meaningful intermediate values.
- Break complex inline math into named intermediate values.
- Assign every returned array, object, result union, and non-trivial value to a
  `result` variable before returning. This includes empty arrays, mapped arrays,
  object literals, status results, and helper-composed values.
- Return structured values with one style:
  `const result = { data }; return result;`.
- Destructure values near first meaningful use.
- Use array destructuring for first-item null fallbacks:
  `const [result = null] = rankedCandidates;`.
- Keep every operation inspectable in a debugger.
- Single ternary expressions are allowed when the branches stay simple.
- Nested ternary expressions are banned everywhere, including tests.

```ts
const data = getData(id);
const parsed = parseData(data);
const result = { parsed };
return result;
```

## Immutability

- Prefer `const`.
- Do not use `var`.
- Use tightly scoped `let` only when immutable code is materially less clear.
- Every property in every object type is `readonly`, not only props types.
- Do not mutate objects or arrays.
- Do not use mutating array methods (`push`, `pop`, `shift`, `unshift`,
  `splice`, `sort`, `reverse`, `fill`, `copyWithin`), even on a freshly created
  array. Use non-mutating equivalents such as `toSorted`, `toReversed`, `with`,
  `concat`, and `slice`.
- Use `as const` for literal value sets that need derived unions.
- Large curated lexical constants must include source or attribution notes near
  the constants, and must not copy third-party dictionaries or tables wholesale.
- Do not use non-null assertions.
- Prefer type narrowing and library types over `as SomeType`.

```ts
const ALLOWED_ROLES = [`admin`, `editor`, `viewer`] as const;
type Role = (typeof ALLOWED_ROLES)[number];
```

## Status Values

Use constants and derived unions instead of enums.

```ts
export const USER_RESULT_STATUS_SUCCESS = `SUCCESS`;
export const USER_RESULT_STATUS_ERROR = `ERROR`;

export const USER_RESULT_STATUSES = [
  USER_RESULT_STATUS_SUCCESS,
  USER_RESULT_STATUS_ERROR,
] as const;

export type UserResultStatus = (typeof USER_RESULT_STATUSES)[number];
```

- Values are UPPER_SNAKE_CASE.
- Do not cast a literal with `as Status` when it already satisfies the union.

## Error Handling

- Async boundaries handle errors or intentionally propagate them through the feature contract.
- Prefer `try/catch` for ordinary awaited async control flow.
- Keep `try/catch` blocks scoped to the fallible operation being handled.
- Structured result success branches use `{ status: SUCCESS, data }`.
- Structured result error branches use `{ status: ERROR, error }`.
- Structured status results use branch-specific payloads only. Do not include
  companion `error: null` fields on success branches or `data: null` fields on
  error branches.
- Schema-backed result errors use `{ message: string; code?: string }`.
- Do not name the success payload after the domain value in a structured
  status result. Use `data` so callers can narrow on `status` and then read the
  payload consistently.
- Runtime `Error` objects are used at throw or abort boundaries.
- Axios errors are checked with `axios.isAxiosError(error)`.
- HTTP status codes are checked explicitly.

```ts
type ExampleResult =
  | {
      readonly status: typeof STATUS_SUCCESS;
      readonly data: Data;
    }
  | {
      readonly status: typeof STATUS_ERROR;
      readonly error: ErrorPayload;
    };
```

## Documentation

Document exported APIs with TSDoc when caller-facing behavior, side effects, or contract details are not obvious from function names and types.

Do not add boilerplate TSDoc to trivial functions.

## Type Shapes

- Object type literals are allowed only as the complete annotation of a named
  type alias.
- Do not nest object type literals inside property types, array element types,
  union members, intersection members, generic arguments, tuple members, mapped
  type values, function parameters, or function return types. Extract the object
  shape into a named type alias.
- Use `readonly T[]` for readonly arrays. Do not use `ReadonlyArray<T>`.
- Use parentheses when the readonly array element type is a union,
  intersection, function type, constructor type, or another shape that needs
  grouping.

```ts
type ChildValue = {
  readonly id: string;
};

type ParentValue = {
  readonly children: readonly ChildValue[];
};
```
