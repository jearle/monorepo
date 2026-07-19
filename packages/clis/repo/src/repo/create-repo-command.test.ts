import { expect, test } from 'bun:test';

import { createLogger } from '../logger';
import { createServices } from '../services';
import { createRepoCommand } from '.';

test(`registers repo feature commands`, () => {
  const env = {
    NODE_ENV: `test`,
    LOG_LEVEL: `fatal`,
  } as const;
  const { logger } = createLogger({ env });
  const { services } = createServices({ env, logger });
  const { repoCommand } = createRepoCommand({
    env,
    logger,
    services,
  });
  const commandNames = repoCommand.commands.map((command) => command.name);

  expect(commandNames).toEqual([
    `compile`,
    `format`,
    `health`,
    `lint`,
    `package`,
    `skeleton`,
    `test`,
    `verify`,
  ]);

  const verifyCommand = repoCommand.commands.find(
    (command) => command.name === `verify`,
  );
  const verifyCommandNames =
    verifyCommand?.commands?.map((command) => command.name) ?? [];

  expect(verifyCommandNames).toEqual([
    `deps`,
    `package-exports`,
    `package-scripts`,
  ]);

  const packageCommand = repoCommand.commands.find(
    (command) => command.name === `package`,
  );
  const packageCommandNames =
    packageCommand?.commands?.map((command) => command.name) ?? [];

  expect(packageCommandNames).toEqual([
    `compile`,
    `format`,
    `lint`,
    `lint-style`,
    `test`,
    `verify`,
  ]);
});
