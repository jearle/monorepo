import { type Attributes, type ReactNode } from 'react';

import { UNINITIALIZED_CONTEXT } from './constants';
export type ProviderPropsShape = { readonly children: ReactNode };

export type ProviderPropsShape2 = { readonly children: ReactNode };

export type ProviderProps<TProps> = (TProps extends Record<string, never>
  ? ProviderPropsShape
  : ProviderPropsShape2 & TProps) &
  Attributes;

export type ProviderEntry<Name extends string, TProps> = {
  [Key in `${Capitalize<Name>}Provider`]: (
    props: ProviderProps<TProps>,
  ) => ReactNode;
};

export type EnsureProviderEntry<Name extends string, TProps> = {
  [Key in `Ensure${Capitalize<Name>}Provider`]: (
    props: ProviderProps<TProps>,
  ) => ReactNode;
};

export type UseContextEntry<Name extends string, TValue> = {
  [Key in `use${Capitalize<Name>}Context`]: () => TValue;
};

export type UseOptionContextEntry<Name extends string, TValue> = {
  [Key in `use${Capitalize<Name>}OptionalContext`]: () =>
    | TValue
    | typeof UNINITIALIZED_CONTEXT;
};

export type CreateContextProviderResult<
  Name extends string,
  TValue,
  TProps,
> = ProviderEntry<Name, TProps> &
  EnsureProviderEntry<Name, TProps> &
  UseContextEntry<Name, TValue> &
  UseOptionContextEntry<Name, TValue>;
