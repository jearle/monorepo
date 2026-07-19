import { expect, test } from 'bun:test';

import { parseEnvText } from '.';

test(`parseEnvText parses env file content`, () => {
  const env = parseEnvText({
    text: `
      # comment
      NODE_ENV="test"
      API_URL=https://api.example.test
      IGNORED
    `,
  });

  expect(env).toEqual({
    API_URL: `https://api.example.test`,
    NODE_ENV: `test`,
  });
});
