import { describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rulesDirectory = path.dirname(fileURLToPath(import.meta.url));
const oxlintPackageDirectory = path.dirname(rulesDirectory);
const repoRoot = path.resolve(oxlintPackageDirectory, '../../..');
const pluginPath = path.join(
  oxlintPackageDirectory,
  'monorepo-conventions-plugin.js',
);
const oxlintBin = path.join(repoRoot, 'node_modules/.bin/oxlint');
const defaultFixtureDirectory = 'packages/utils/fixture/src/fixture';

const formatOxlintOutput = ({ exitCode, stderr, stdout }) =>
  [
    `exitCode: ${exitCode}`,
    stdout.length === 0 ? null : `stdout:\n${stdout}`,
    stderr.length === 0 ? null : `stderr:\n${stderr}`,
  ]
    .filter((value) => value !== null)
    .join('\n\n');

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`);

const getMessageRegExp = (message) => {
  const pattern = message
    .split(/\{\{\s*[^}]+\s*\}\}/u)
    .map(escapeRegExp)
    .join('[\\s\\S]+');
  const result = new RegExp(`^${pattern}$`, 'u');

  return result;
};

const getRuleCode = (ruleName) => {
  const [pluginName, ruleId] = ruleName.split('/');
  const result = `${pluginName}(${ruleId})`;

  return result;
};

const getFixtureExtension = ({ code, filename }) => {
  if (filename !== undefined) {
    const extension = path.extname(filename);

    if (extension.length > 0) {
      return extension;
    }
  }

  const hasJsxSyntax =
    /<[A-Z][\w.]*[\s>/]/u.test(code) || /<\/[A-Z][\w.]*>/u.test(code);
  const result = hasJsxSyntax ? '.tsx' : '.ts';

  return result;
};

const mapRepoFilename = (filename, fixtureRoot) => {
  if (filename.startsWith('/repo/')) {
    return path.join(fixtureRoot, filename.slice('/repo/'.length));
  }

  return filename;
};

const getCaseFilename = ({ code, filename }, fixtureRoot, index) => {
  if (filename !== undefined && path.isAbsolute(filename)) {
    return mapRepoFilename(filename, fixtureRoot);
  }

  const extension = getFixtureExtension({ code, filename });
  const basename = filename ?? `case-${index}${extension}`;
  const result = path.join(fixtureRoot, defaultFixtureDirectory, basename);

  return result;
};

const mapRepoPathValues = (value, fixtureRoot) => {
  if (typeof value === 'string') {
    return mapRepoFilename(value, fixtureRoot);
  }

  if (Array.isArray(value)) {
    return value.map((item) => mapRepoPathValues(item, fixtureRoot));
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value).map(([key, item]) => [
      key,
      mapRepoPathValues(item, fixtureRoot),
    ]);
    const result = Object.fromEntries(entries);

    return result;
  }

  return value;
};

const createRuleSetting = (testCase, fixtureRoot) => {
  const options = testCase.options?.map((option) =>
    mapRepoPathValues(option, fixtureRoot),
  );

  if (options === undefined || options.length === 0) {
    return 'error';
  }

  const result = ['error', ...options];

  return result;
};

const createConfig = ({ fixtureRoot, ruleName, testCase }) => {
  const configPath = path.join(fixtureRoot, '.oxlintrc.json');
  const config = {
    env: {
      browser: true,
      es2026: true,
      node: true,
    },
    globals: {
      Bun: 'readonly',
    },
    jsPlugins: [
      {
        name: 'monorepo-conventions',
        specifier: pluginPath,
      },
    ],
    rules: {
      [ruleName]: createRuleSetting(testCase, fixtureRoot),
    },
  };

  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  return configPath;
};

const parseDiagnostics = (stdout) => {
  if (stdout.trim().length === 0) {
    return [];
  }

  const output = JSON.parse(stdout);
  const result = output.diagnostics ?? [];

  return result;
};

const runOxlint = ({ configPath, fix = false, filename }) => {
  const args = [
    filename,
    '--config',
    configPath,
    '--format',
    'json',
    '--no-error-on-unmatched-pattern',
    '--allow',
    'all',
  ];

  if (fix) {
    args.push('--fix');
  }

  const result = Bun.spawnSync({
    cmd: [oxlintBin, ...args],
    cwd: repoRoot,
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);

  return {
    diagnostics: parseDiagnostics(stdout),
    exitCode: result.exitCode,
    stderr,
    stdout,
  };
};

const writeFixture = ({ code, filename }) => {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, code);
};

const writeExtraFixtures = (testCase, fixtureRoot) => {
  const files = testCase.files ?? {};

  Object.entries(files).forEach(([filename, code]) => {
    const mappedFilename = mapRepoFilename(filename, fixtureRoot);
    writeFixture({ code, filename: mappedFilename });
  });
};

const createFixture = (testCase, index) => {
  const fixtureRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'monorepo-oxlint-rule-test-'),
  );
  const filename = getCaseFilename(testCase, fixtureRoot, index);

  writeFixture({ code: testCase.code, filename });
  writeExtraFixtures(testCase, fixtureRoot);

  return { filename, fixtureRoot };
};

const getRuleDiagnostics = ({ diagnostics, ruleName }) => {
  const ruleCode = getRuleCode(ruleName);
  const result = diagnostics.filter(
    (diagnostic) => diagnostic.code === ruleCode,
  );

  return result;
};

const expectValidCase = ({ ruleName, testCase }, index) => {
  const { filename, fixtureRoot } = createFixture(testCase, index);
  const configPath = createConfig({ fixtureRoot, ruleName, testCase });
  const result = runOxlint({ configPath, filename });

  expect(result.exitCode, formatOxlintOutput(result)).toBe(0);
  expect(result.diagnostics, formatOxlintOutput(result)).toHaveLength(0);
};

const expectExpectedDiagnostics = ({ result, rule, ruleName, testCase }) => {
  const expectedErrors = testCase.errors ?? [];
  const diagnostics = getRuleDiagnostics({
    diagnostics: result.diagnostics,
    ruleName,
  });

  expect(diagnostics, formatOxlintOutput(result)).toHaveLength(
    expectedErrors.length,
  );

  expectedErrors.forEach((expectedError, index) => {
    const diagnostic = diagnostics[index];
    const messageId = expectedError.messageId;
    const expectedMessage = rule.meta.messages[messageId];

    expect(
      diagnostic?.message,
      `Expected messageId ${messageId} for ${ruleName}`,
    ).toMatch(getMessageRegExp(expectedMessage));
  });
};

const expectFixOutput = ({ configPath, filename, testCase }) => {
  if (!Object.hasOwn(testCase, 'output')) {
    return;
  }

  const fixResult = runOxlint({ configPath, filename, fix: true });
  const fixedCode = fs.readFileSync(filename, 'utf8');
  const expectedOutput = testCase.output ?? testCase.code;

  expect(fixedCode, formatOxlintOutput(fixResult)).toBe(expectedOutput);
};

const expectInvalidCase = ({ rule, ruleName, testCase }, index) => {
  const { filename, fixtureRoot } = createFixture(testCase, index);
  const configPath = createConfig({ fixtureRoot, ruleName, testCase });
  const result = runOxlint({ configPath, filename });

  expect(result.exitCode, formatOxlintOutput(result)).not.toBe(0);
  expectExpectedDiagnostics({ result, rule, ruleName, testCase });
  expectFixOutput({ configPath, filename, testCase });
};

const getCaseName = (kind, testCase, index) => {
  const codePreview = testCase.code.replace(/\s+/gu, ' ').trim().slice(0, 80);
  const result = `${kind} ${index + 1}: ${codePreview}`;

  return result;
};

export const createOxlintTestHarness = () => ({
  run(ruleName, rule, cases) {
    describe(ruleName, () => {
      cases.valid.forEach((testCase, index) => {
        test(getCaseName('valid', testCase, index), () => {
          expectValidCase({ ruleName, testCase }, index);
        });
      });

      cases.invalid.forEach((testCase, index) => {
        test(getCaseName('invalid', testCase, index), () => {
          expectInvalidCase({ rule, ruleName, testCase }, index);
        });
      });
    });
  },
});
