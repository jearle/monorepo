import { createContext, use } from 'react';

import { UNINITIALIZED_CONTEXT } from './constants';

import { type CreateContextProviderResult, type ProviderProps } from './types';

export type CreateContextProviderProps<Name extends string, TValue, TProps> = {
  readonly useHook: (props: ProviderProps<TProps>) => TValue;
  readonly name: Name;
};
export const createContextProvider = <Name extends string, TValue, TProps>(
  props: CreateContextProviderProps<Name, TValue, TProps>,
) => {
  const { useHook, name } = props;

  const [firstLetter = ``] = name;

  if (firstLetter === ``) {
    throw new Error(`createContextProvider: 'name' must be non-empty`);
  }

  const isLowerCased = firstLetter !== firstLetter.toUpperCase();

  if (isLowerCased) {
    throw new Error(
      `createContextProvider: 'name' must be title cased (got '${name}')`,
    );
  }

  const providerKey = `${name}Provider`;
  const ensureProviderKey = `Ensure${name}Provider`;
  const useContextKey = `use${name}Context`;
  const useOptionalContextKey = `use${name}OptionalContext`;

  const Context = createContext<TValue | typeof UNINITIALIZED_CONTEXT>(
    UNINITIALIZED_CONTEXT,
  );

  const Provider = (props: ProviderProps<TProps>) => {
    const { children } = props;

    const value = useHook(props);

    return <Context value={value}>{children}</Context>;
  };

  const useContext = () => {
    const context = use(Context);

    if (context === UNINITIALIZED_CONTEXT) {
      throw new Error(`useContext must be used within a Provider`);
    }

    return context;
  };

  const useOptionalContext = () => {
    const context = use(Context);

    return context;
  };

  const EnsureProvider = (props: ProviderProps<TProps>) => {
    const { children } = props;

    const optionalContext = useOptionalContext();

    if (optionalContext !== UNINITIALIZED_CONTEXT) {
      return children;
    }

    return <Provider {...props} />;
  };

  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- TypeScript cannot prove computed keys from the runtime provider name.
  const result = {
    [providerKey]: Provider,
    [ensureProviderKey]: EnsureProvider,
    [useContextKey]: useContext,
    [useOptionalContextKey]: useOptionalContext,
  } as unknown as CreateContextProviderResult<Name, TValue, TProps>;

  return result;
};
