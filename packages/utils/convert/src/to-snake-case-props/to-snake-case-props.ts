import mapKeys from 'lodash.mapkeys';
import snakeCase from 'lodash.snakecase';

import { type UnknownObject } from '../unknown-object';

export const toSnakeCaseProps = <
  TSnakeCasedObject,
  TUknownObject extends UnknownObject = UnknownObject,
>(
  object: TUknownObject,
): null | TSnakeCasedObject => {
  if (typeof object !== 'object') {
    return null;
  }

  if (object === null) {
    return null;
  }

  if (Array.isArray(object)) {
    return null;
  }

  const snakeCasedObject = mapKeys(object, (_value, key) => {
    const nextKey = snakeCase(key);
    return nextKey;
  });

  return snakeCasedObject as TSnakeCasedObject;
};
