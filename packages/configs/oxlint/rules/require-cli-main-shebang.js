import { getRuleFilename, getRuleSourceCode } from './rule-path-helpers.js';

const bunShebang = `#!/usr/bin/env bun`;

const checkIsCliMainFilename = (filename) =>
  /\/packages\/clis\/[^/]+\/src\/main\.ts$/u.test(filename) ||
  /\/packages\/apps\/(?:[^/]+-)?cli(?:-[^/]+)?\/src\/main\.ts$/u.test(filename);

export const requireCliMainShebangRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require Bun shebangs on CLI main entrypoints.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      requireCliMainShebang: `CLI src/main.ts entrypoints must start with #!/usr/bin/env bun.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isCliMainFilename = checkIsCliMainFilename(filename);

    if (!isCliMainFilename) {
      return {};
    }

    return {
      Program(node) {
        const sourceCode = getRuleSourceCode(context);
        const hasBunShebang = sourceCode.text.startsWith(bunShebang);

        if (hasBunShebang) {
          return;
        }

        context.report({
          node,
          messageId: `requireCliMainShebang`,
          fix(fixer) {
            const firstLine = sourceCode.text.split(/\r?\n/u, 1)[0] ?? ``;

            if (firstLine.startsWith(`#!`)) {
              return fixer.replaceTextRange([0, firstLine.length], bunShebang);
            }

            return fixer.insertTextBeforeRange([0, 0], `${bunShebang}\n`);
          },
        });
      },
    };
  },
};
