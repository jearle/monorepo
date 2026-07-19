import { getRuleFilename } from './rule-path-helpers.js';

const utilTerminalSourcePathPattern =
  /(?:^|\/)packages\/utils\/terminal\/src\//u;

const ansiEscapePattern = /\\(?:x1[bB]|u001[bB]|u\{1[bB]\}|033)/u;

const checkIsUtilTerminalSource = (filename) =>
  utilTerminalSourcePathPattern.test(filename);

const checkHasAnsiEscape = (value, raw) => {
  if (value.includes(`\u001b`)) {
    return true;
  }

  return ansiEscapePattern.test(raw);
};

export const noInlineAnsiEscapesRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Forbid inline ANSI escape constants outside @jearle/util-terminal.`,
    },
    schema: [],
    messages: {
      noInlineAnsiEscape: `Use @jearle/util-terminal instead of inline ANSI escape constants.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);

    if (checkIsUtilTerminalSource(filename)) {
      return {};
    }

    const sourceCode = context.sourceCode;

    return {
      Literal(node) {
        if (typeof node.value !== `string`) {
          return;
        }

        const raw = sourceCode.getText(node);
        const hasAnsiEscape = checkHasAnsiEscape(node.value, raw);

        if (hasAnsiEscape === false) {
          return;
        }

        context.report({
          node,
          messageId: `noInlineAnsiEscape`,
        });
      },

      TemplateElement(node) {
        const value = node.value.cooked ?? node.value.raw;
        const hasAnsiEscape = checkHasAnsiEscape(value, node.value.raw);

        if (hasAnsiEscape === false) {
          return;
        }

        context.report({
          node,
          messageId: `noInlineAnsiEscape`,
        });
      },
    };
  },
};
