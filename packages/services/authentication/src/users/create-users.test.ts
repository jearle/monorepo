import { test, expect } from 'bun:test';

import { createDatabase } from '../test';
import { createUsers } from './create-users';

const setupUsers = async () => {
  const { db } = await createDatabase();
  const { users } = createUsers({ db });

  const result = { users };

  return result;
};

test(`createUsers({ db })`, async () => {
  const { users } = await setupUsers();
  expect(users).toBeDefined();
});

test(`users:
  users.create({ email, firstName, lastName, passwordHash })
  users.read({ id })
  users.readBy({ email })
  users.update({ id, firstName, deletedAt })
  users.destroy({ id })`, async () => {
  const { users } = await setupUsers();

  const testUser = {
    email: `test@gmail.com`,
    firstName: `jesse`,
    lastName: `earle`,
    passwordHash: `some-hash`,
  };
  // create
  const createResult = await users.create(testUser);

  const { success: successCreate } = createResult;

  if (successCreate === false) {
    expect(successCreate).toBeTrue();

    return;
  }

  const { entity: userCreated } = createResult;
  expect(userCreated).toBeDefined();

  const { id } = userCreated;

  // read
  const readResult = await users.read({
    id,
  });

  const { success: successRead } = readResult;

  if (successRead === false) {
    expect(successRead).toBeTrue();

    return;
  }

  const { entity: userRead } = readResult;

  expect(userRead).toBeDefined();

  // readBy
  const readByResult = await users.readBy({
    email: testUser.email,
  });

  const { success: successReadBy } = readByResult;

  if (successReadBy === false) {
    expect(successRead).toBeTrue();

    return;
  }

  const { entity: userReadBy } = readByResult;

  expect(userReadBy).toBeDefined();

  // update
  const updateResult = await users.update({
    id,
    firstName: `Leon`,
    lastName: `Kennedy`,
  });

  const { success: successUpdate } = updateResult;

  if (successUpdate === false) {
    console.error(updateResult.error);
    expect(successUpdate).toBeTrue();

    return;
  }

  const { entity: userUpdated } = updateResult;

  expect(userUpdated).toBeDefined();

  // destroy
  const destroyResult = await users.destroy({
    id,
  });

  const { success: successDestroy } = destroyResult;

  if (successDestroy === false) {
    console.error(destroyResult.error);
    expect(successDestroy).toBeTrue();

    return;
  }

  const { user: userDestroyed } = destroyResult;

  expect(userDestroyed).toBeDefined();
});
