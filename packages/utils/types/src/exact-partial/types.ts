import { type ExcludeUndefinedValueTypes } from '../exclude-undefined-value-types';

export type ExactPartial<T> = Partial<ExcludeUndefinedValueTypes<T>>;
