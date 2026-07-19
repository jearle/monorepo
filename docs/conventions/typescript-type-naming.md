# TypeScript Type Naming

Use role suffixes for helper types.

## Standard Names

- Function-specific required inputs: `CreateThingProps`
- Shared dependency context: `ThingContext`
- Optional call modifiers for a single operation: `ThingOptions`
- Exported structured result unions: `CreateThingResult`

Use `domain-modeling.md` for package-local domain names. Do not repeat the
package or domain prefix in exported type names when the package context already
identifies the domain.

## Placement

Use one placement rule per helper role.

- `...Props` lives beside the function that owns the required operation inputs.
- Public `...Props` is exported from the owning function file when the owning function is exported.
- Public `...Context` lives in the feature `types.ts`.
- Public `...Options` lives in the feature `types.ts`.
- Public `...Result` lives in the feature `types.ts`.
- `...Result` aliases derived with `ReturnType<typeof ...>` stay beside the function they derive from.
- `...Service` aliases derived with `ReturnType<typeof create...Service>` stay beside their service factory for the same reason.
- Private `...Result` aliases stay beside non-exported helpers.
- Private one-off implementation helper types stay beside the implementation when they are absent from public signatures.
- Extracted object shapes that are shared, public, or referenced by public
  schema-package contracts live in the nearest feature `types.ts`.
- Extracted private one-off object shapes stay beside the implementation or
  private helper that owns them.

```ts
// types.ts
export type RepoCommandContext = {
  readonly env: Env;
  readonly logger: Logger;
  readonly services: Services;
};

export type CreateUserOptions = {
  readonly notify?: boolean;
};

export type CreateUserResult =
  | {
      readonly status: typeof CREATE_USER_STATUS_SUCCESS;
      readonly data: User;
    }
  | {
      readonly status: typeof CREATE_USER_STATUS_ERROR;
      readonly error: ResultError;
    };

// create-user.ts
import {
  type CreateUserOptions,
  type CreateUserResult,
  type RepoCommandContext,
} from './types';

export type CreateUserProps = {
  readonly email: string;
};

export const createUser = (
  ctx: RepoCommandContext,
  props: CreateUserProps,
  options: CreateUserOptions = {},
): CreateUserResult => {
  const { email } = props;
  const { notify = false } = options;
  const result = createUserResult({ email, notify, ctx });
  return result;
};
```

## Props

Use `...Props` for required operation inputs owned by one function.
Named functions with a `props` parameter use the function-owned named props
type directly in the signature. Public props types are exported from the owning
function file and placed immediately above the function. Private props types are
placed immediately above the private function they support.

```ts
export type UpdateUserProps = {
  readonly id: string;
  readonly data: UserUpdate;
};

export const updateUser = (props: UpdateUserProps) => {
  const { id, data } = props;
  const result = { id, data };
  return result;
};
```

Use the shared context type directly when a function receives only shared dependencies.

```ts
export const createRepoCommand = (ctx: RepoCommandContext) => {
  const { repoHealthCommand } = createRepoHealthCommand(ctx);
  const result = { repoHealthCommand };
  return result;
};
```

## Context

Use `...Context` for shared dependencies that are carried through layers.

```ts
export type RepoCommandContext = {
  readonly env: Env;
  readonly logger: Logger;
  readonly services: Services;
};
```

## Options

Use `...Options` for optional caller-tunable modifiers for a single operation.
Use the same suffix for resolved or normalized option shapes that flow through
an `options` parameter or `options` props property. Do not use `Config` for a
type that is passed around as `options`.

```ts
// types.ts
export type ToJsonOptions = {
  readonly space?: number;
};

// to-json.ts
import { type ToJsonOptions } from './types';

export const toJson = (value: unknown, options: ToJsonOptions = {}) => {
  const { space } = options;
  const result = JSON.stringify(value, null, space);
  return result;
};
```

Use `...Props` for required operation data.

## Result

Use `...Result` only when exported callers need the named return type, especially for structured result unions.
Exported functions that return a named structured result use the exported
`...Result` annotation from the feature `types.ts`.

```ts
// types.ts
export type CreateUserResult =
  | {
      readonly status: typeof SUCCESS;
      readonly data: User;
    }
  | {
      readonly status: typeof ERROR;
      readonly error: ResultError;
    };
```
