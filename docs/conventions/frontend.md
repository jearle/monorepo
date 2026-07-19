# Frontend

Frontend code follows the same module, TypeScript, validation, and testing conventions as the rest of the repo.

## Structure

- App packages reserve `src/app/` for the top-level app shell.
- App features live in flat sibling folders at `src/<feature>/`.
- UI components include a co-located `Example.tsx`.
- Component files may use `CapitalCase.tsx`.
- Non-component files and folders use kebab-case.

## State Management

Use the Jotai async/loadable/derived/hook pattern for shared async state.

1. Async source atom
2. `loadable` wrapper
3. Read-only derived atoms
4. Public hook returning a structured object

```ts
const userAPIAsyncState = atom(async (get) => {
  const config = await get(configState);
  const { userAPI } = createUserAPI({ url: config.userURL });
  return userAPI;
});

const userAPILoadableState = loadable(userAPIAsyncState);

export const isLoadingUserAPIState = atom(
  (get) => get(userAPILoadableState).state === `loading`,
);

export const userAPIErrorState = atom((get) => {
  const loadableState = get(userAPILoadableState);
  const error = loadableState.state === `hasError` ? loadableState.error : null;
  return error;
});

export const useUserAPIState = () => {
  const isLoading = useAtomValue(isLoadingUserAPIState);
  const error = useAtomValue(userAPIErrorState);
  const userAPI = useAtomValue(userAPIState);
  const result = { isLoading, error, userAPI };
  return result;
};
```

Hooks return `{ isLoading, error, <domainData> }` where `<domainData>` is
domain-specific. The `isLoading` and `error` keys are required on every state
hook result; `error` is `null` when the source has not rejected.

## UI Tests And Examples

- Public UI behavior is tested through the feature/component public entrypoint.
- Examples show the component in a realistic local state.
- Avoid tests that only assert internal implementation details.

## Semantic Review

The following frontend conventions require reviewer judgment and are not encoded
as deterministic lint rules:

- Whether an example represents realistic local state.
- Whether a UI test asserts public behavior instead of implementation detail.
- Whether a hook result's domain-specific data names are the clearest names for
  the user workflow.
