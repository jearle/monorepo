import mapKeys from 'lodash.mapkeys';
import camelCase from 'lodash.camelcase';

import { type UnknownObject } from '../unknown-object';

export const toCamelCaseProps = <
  TCameCasedObject,
  TUnknownObject extends UnknownObject = UnknownObject,
>(
  object: TUnknownObject,
): null | TCameCasedObject => {
  if (typeof object !== 'object') {
    return null;
  }

  if (object === null) {
    return null;
  }

  if (Array.isArray(object)) {
    return null;
  }

  const camelCasedObject = mapKeys(object, (_value, key) => {
    const nextKey = camelCase(key);
    return nextKey;
  });

  return camelCasedObject as TCameCasedObject;
};
