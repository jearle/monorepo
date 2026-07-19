# Dependency Context

Functions that need shared dependencies accept `ctx: FeatureContext` directly.

## Function Shapes

Use `ctx` for shared dependencies such as `env`, `logger`, `services`, stores, clients, and defaults.

```ts
export const createRepoCommand = (ctx: RepoCommandContext) => {
  const { repoHealthCommand } = createRepoHealthCommand(ctx);
  const result = { repoCommand };
  return result;
};
```

Use `props` for required operation inputs. Helpers that need both dependencies and operation data receive `ctx` first and `props` second.

```ts
const submitUser = async (ctx: UserServiceContext, props: SubmitUserProps) => {
  const { httpClient } = ctx;
  const { user } = props;
  const result = await httpClient.post({ user });
  return result;
};
```

Use `options` for optional call modifiers. Pass `options` after required props.

```ts
const stringifyJSON = (
  props: JsonStringifyProps,
  options: JsonStringifyOptions = {},
) => {
  const { value } = props;
  const { space = 2 } = options;
  const result = JSON.stringify(value, null, space);
  return result;
};
```

CLI adapter helpers that read input, write output, or fail commands receive the
app-level context so `env` and `logger` flow down from composition.

Pure helpers that only transform local values do not take `ctx`.

## Avoid Context Wrappers

Do not wrap an existing context object as `{ ctx }` when passing it downward.

```ts
const { repoCommand } = createRepoCommand({ ctx });

const { repoCommand } = createRepoCommand(ctx);
```

When a function receives app construction props that are exactly the shared dependency context, passing `props` into a context-taking child is acceptable.

```ts
export const createApp = async (props: CreateAppProps) => {
  const { repoCommand } = createRepoCommand(props);
  const result = { repoCommand };
  return result;
};
```
