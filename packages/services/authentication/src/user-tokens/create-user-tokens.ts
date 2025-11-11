import { type PostgresDatabase } from '@jearle/lib-postgres';
import { createEntityCRUD } from '@jearle/util-database';

import { TABLE_NAME_USER_TOKENS } from './constants';
import { type UserToken } from './types';

export type PropsCreateUserTokens = {
  readonly db: PostgresDatabase;
};
export const createUserTokens = (props: PropsCreateUserTokens) => {
  const { db } = props;

  const userTokens = createEntityCRUD<UserToken>({
    db,
    table: TABLE_NAME_USER_TOKENS,
  });

  const result = { userTokens };

  return result;
};

export type UserTokens = ReturnType<typeof createUserTokens>[`userTokens`];
