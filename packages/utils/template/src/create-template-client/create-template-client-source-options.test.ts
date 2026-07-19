import { expect, test } from 'bun:test';
import { RESULT_STATUS_ERROR } from '@jearle/util-result';

import { TEMPLATE_INVALID_OPTIONS_ERROR_CODE } from '../errors';

import { createTemplateClient } from '.';

test(`source root normalization failures remain structured and safe`, async () => {
  const secret = `ABSOLUTE_PATH_SENTINEL`;
  const root = new Proxy<readonly string[]>([], {
    get: (target, property, receiver) => {
      if (property === `map`) {
        throw new Error(secret);
      }

      const result: unknown = Reflect.get(target, property, receiver);

      return result;
    },
  });
  let thrown: unknown;
  let result;

  try {
    const { templateClient } = createTemplateClient({ root });

    result = await templateClient.render(`text`, {});
  } catch (error) {
    thrown = error;
  }

  expect(thrown).toBeUndefined();
  expect(result?.status).toBe(RESULT_STATUS_ERROR);

  if (result?.status !== RESULT_STATUS_ERROR) {
    expect.unreachable();
  }

  expect(result.error.code).toBe(TEMPLATE_INVALID_OPTIONS_ERROR_CODE);
  expect(result.error.message).not.toContain(secret);
});
