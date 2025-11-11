import { type PostgresDatabase } from '@jearle/lib-postgres';
import { createEntityCRUD } from '@jearle/util-database';

import { TABLE_NAME_USERS } from './constants';
import type { User } from './types';

export type PropsCreateUsers = {
  readonly db: PostgresDatabase;
};
export const createUsers = (props: PropsCreateUsers) => {
  const { db } = props;

  const { create, read, readBy, update, destroy } = createEntityCRUD<User>({
    db,
    table: TABLE_NAME_USERS,
  });

  const users = { create, read, update, destroy, readBy };

  const result = { users };

  return result;
};

export type Users = ReturnType<typeof createUsers>[`users`];
