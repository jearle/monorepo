# Validation

Use Zod 4 schemas at system boundaries and trust TypeScript inside the monorepo.

## Schema First

- Define schemas first in `packages/schemas/`.
- Use `domain-modeling.md` when deciding whether a schema represents a durable
  entity, an entity base, or a non-entity keyed value.
- Package-local schemas in non-schema packages live in a feature file named
  `<x>-schema.ts`. Keep the file name singular, for example
  `message-schema.ts` or `open-ai-completion-schema.ts`.
- Derive types with `z.infer<typeof Schema>`.
- Do not manually define types that duplicate schemas.
- Use current Zod 4 schema forms:
  - Strict object contracts: `z.strictObject({ ... })`.
  - Loose object contracts: `z.looseObject({ ... })`.
  - Integer values: `z.int()`.
  - String format scalars: `z.uuid()`, `z.email()`, `z.url()`, `z.ipv4()`,
    and `z.iso.datetime()`.
  - Object composition: object shape spreading or `.extend()`.
- Use explicit `.min(1)` when a collection or string needs at least one item
  or character.
- If a public schema exposes a meaningful domain scalar on a public property,
  export the scalar schema and its derived type too. Export refinement helper
  props only when consumers need to name those helper inputs directly.
- Do not use deprecated `z.ZodIssueCode`. Use the raw Zod issue code value
  required by Zod. Reused Zod issue-code values use shared constants from
  `@jearle/lib-zod`.
- Use `ZOD_ISSUE_CODE_CUSTOM` from `@jearle/lib-zod` for reused custom
  refinement issue codes.

Deprecated Zod APIs are blocked by oxlint. When updating older code, migrate
with this map:

| Older form                        | Current form                   |
| --------------------------------- | ------------------------------ |
| `z.object({ ... }).strict()`      | `z.strictObject({ ... })`      |
| `z.object({ ... }).passthrough()` | `z.looseObject({ ... })`       |
| `z.number().int()`                | `z.int()`                      |
| `z.string().uuid()`               | `z.uuid()`                     |
| `z.string().email()`              | `z.email()`                    |
| `z.string().url()`                | `z.url()`                      |
| `z.string().ipv4()`               | `z.ipv4()`                     |
| `z.string().datetime()`           | `z.iso.datetime()`             |
| `SchemaA.merge(SchemaB)`          | shape spreading or `.extend()` |

```ts
import { z } from 'zod';

export const UserIdSchema = z.uuid();
export type UserId = z.infer<typeof UserIdSchema>;

export const UserSchema = z.strictObject({
  id: UserIdSchema,
  email: z.email(),
});

export type User = z.infer<typeof UserSchema>;
```

## Schema Refinement Issues

Use immutable issue-producing helpers when a refinement has more than one
issue-producing check or shares issue construction with another refinement.

- Issue-producing helpers return readonly issue arrays and use `get*Issues`
  names.
- Name the feature-local readonly issue-array alias `RefinementIssues`.
- Pass domain values and lookup data into issue-producing helpers. Keep
  `RefinementCtx` in the refinement boundary function.
- Issue-producing helpers do not receive `ctx` and do not call `ctx.addIssue`.
- Refinement boundary functions compose issue arrays and emit them with
  `ctx.addIssue` in the final boundary loop.
- Construct fresh issue object literals inside each helper call.
- Preserve full issue payloads, issue counts, and issue order when extracting
  helpers.
- Unknown-reference helpers keep one issue per call site. Combine independent
  reference checks into an aggregate issue only when the public schema contract
  already does that.
- Keep feature-specific issue array helper types private to the feature folder.
  Public entrypoints export schemas and public contract types; internal
  issue-helper types stay private.

```ts
import { type RefinementCtx } from 'zod';
import { type $ZodSuperRefineIssue } from 'zod/v4/core';
import { ZOD_ISSUE_CODE_CUSTOM } from '@jearle/lib-zod';

type RefinementIssues = readonly $ZodSuperRefineIssue[];

type GetUserIssuesProps = {
  readonly value: User;
};

const getUserIssues = (props: GetUserIssuesProps): RefinementIssues => {
  const { value } = props;

  if (value.name.length > 0) {
    const result: RefinementIssues = [];
    return result;
  }

  const result: RefinementIssues = [
    {
      code: ZOD_ISSUE_CODE_CUSTOM,
      message: `name is required`,
      path: [`name`],
    },
  ];
  return result;
};

export type RefineUserProps = {
  readonly ctx: RefinementCtx;
  readonly value: User;
};

export const refineUser = (props: RefineUserProps) => {
  const { ctx, value } = props;
  const issues = getUserIssues({ value });

  for (const issue of issues) {
    ctx.addIssue(issue);
  }
};
```

## Boundary Validation

- Use `safeParse()` to validate. Do not use `Schema.parse()` anywhere outside
  schema packages; `parse()` is reserved for schema-package internals.
- Return validation failures in structured results, not exceptions.
- Do not throw schema validation errors from any non-schema package source.
- CLI, app, or request boundaries log validation failures at most once.

```ts
const validationResult = UserSchema.safeParse(value);

if (validationResult.success === false) {
  const result = {
    status: VALIDATION_ERROR,
    error: {
      message: validationResult.error.message,
      code: `VALIDATION_ERROR`,
    },
  };
  return result;
}

const result = {
  status: SUCCESS,
  data: validationResult.data,
};
return result;
```

## Internal Values

Internal monorepo functions trust TypeScript types. Do not revalidate values that already crossed a typed and validated boundary.

Parse schema-shaped external input at the boundary before helper or service
logic inspects nested fields. Do not manually inspect `unknown` object shape,
branch on the partial result, and then run the schema as a late consistency
check. After `safeParse()` succeeds, pass the typed value to internal helpers.

```ts
// Bad
const processUser = (props: { readonly user: User }) => {
  const validationResult = UserSchema.safeParse(props.user);
  return validationResult;
};

// Good
const processUser = (props: { readonly user: User }) => {
  const { user } = props;
  const result = { email: user.email };
  return result;
};
```

## Environment Variables

Access environment variables through `createEnv()`, not direct `process.env` casts.

`createEnv()` validates against a Zod schema at startup and returns typed variables.
