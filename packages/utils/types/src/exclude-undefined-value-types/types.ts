import { type Simplify } from 'type-fest';

export type ExcludeUndefinedValueTypes<T> = Simplify<{
  [K in keyof T]: Exclude<T[K], undefined>;
}>;
