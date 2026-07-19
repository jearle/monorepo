export const orderImportSpecifiersRule = {
  meta: {
    type: `layout`,
    docs: {
      description: `Order named import and re-export specifiers by type, constants, then values.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      orderImportSpecifiers: `Order named import and re-export specifiers by type, constants, then values, alphabetized within each group.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const constantNamePattern = /^[A-Z][A-Z0-9_]*$/;

    const getSpecifierName = (specifier) => {
      const named =
        specifier.type === `ExportSpecifier`
          ? specifier.exported
          : specifier.imported;

      if (named.type === `Identifier`) {
        return named.name;
      }

      const result = String(named.value);

      return result;
    };

    const getLocalSpecifierName = (specifier) => {
      const local = specifier.local;

      if (local.type === `Identifier`) {
        return local.name;
      }

      const result = String(local.value);

      return result;
    };

    const getSpecifierKind = (specifier) =>
      specifier.importKind ?? specifier.exportKind ?? `value`;

    const getDeclarationKind = (node) =>
      node.importKind ?? node.exportKind ?? `value`;

    const getSpecifierCategory = (specifier, node) => {
      if (
        getDeclarationKind(node) === `type` ||
        getSpecifierKind(specifier) === `type`
      ) {
        return 0;
      }

      const specifierName = getSpecifierName(specifier);

      if (constantNamePattern.test(specifierName)) {
        return 1;
      }

      return 2;
    };

    const compareText = (left, right) => {
      if (left < right) {
        return -1;
      }

      if (left > right) {
        return 1;
      }

      return 0;
    };

    const compareSpecifiers = (node) => (left, right) => {
      const leftCategory = getSpecifierCategory(left, node);
      const rightCategory = getSpecifierCategory(right, node);

      if (leftCategory !== rightCategory) {
        return leftCategory - rightCategory;
      }

      const nameComparison = compareText(
        getSpecifierName(left),
        getSpecifierName(right),
      );

      if (nameComparison !== 0) {
        return nameComparison;
      }

      const localNameComparison = compareText(
        getLocalSpecifierName(left),
        getLocalSpecifierName(right),
      );

      return localNameComparison;
    };

    const getAreSpecifiersOrdered = (specifiers, orderedSpecifiers) => {
      const result = specifiers.every((specifier, index) => {
        const orderedSpecifier = orderedSpecifiers.at(index);
        const isOrdered = specifier === orderedSpecifier;

        return isOrdered;
      });

      return result;
    };

    const getBraceTokens = (node) => {
      const tokens = sourceCode.getTokens(node);
      const openBrace = tokens.find((token) => {
        const isOpenBrace = token.value === `{`;

        return isOpenBrace;
      });
      const closeBrace = tokens.findLast((token) => {
        const isCloseBrace = token.value === `}`;

        return isCloseBrace;
      });

      if (openBrace === undefined || closeBrace === undefined) {
        return null;
      }

      const result = { closeBrace, openBrace };

      return result;
    };

    const getHasSpecifierComments = (openBrace, closeBrace) => {
      const comments = sourceCode.getAllComments();
      const result = comments.some((comment) => {
        const isInsideSpecifiers =
          comment.range[0] > openBrace.range[0] &&
          comment.range[1] < closeBrace.range[1];

        return isInsideSpecifiers;
      });

      return result;
    };

    const getIndentBefore = (index) => {
      const text = sourceCode.text;
      const lineStart = text.lastIndexOf(`\n`, index) + 1;
      const indent = text.slice(lineStart, index);

      if (/^[ \t]*$/.test(indent) === false) {
        return `  `;
      }

      return indent;
    };

    const createSpecifiersReplacement = (
      node,
      specifiers,
      orderedSpecifiers,
      openBrace,
      closeBrace,
    ) => {
      if (getHasSpecifierComments(openBrace, closeBrace)) {
        return null;
      }

      const specifierTexts = orderedSpecifiers.map((specifier) => {
        const text = sourceCode.getText(specifier);

        return text;
      });
      const declarationText = sourceCode.getText(node);
      const isMultiline = declarationText.includes(`\n`);

      if (isMultiline === false) {
        const result = ` ${specifierTexts.join(`, `)} `;

        return result;
      }

      const [firstSpecifier] = specifiers;
      const specifierIndent = getIndentBefore(firstSpecifier.range[0]);
      const closingIndent = getIndentBefore(closeBrace.range[0]);
      const result =
        `\n${specifierIndent}` +
        specifierTexts.join(`,\n${specifierIndent}`) +
        `,\n${closingIndent}`;

      return result;
    };

    const reportUnorderedSpecifiers = (node, specifierType) => {
      const specifiers = node.specifiers.filter((specifier) => {
        const isNamedSpecifier = specifier.type === specifierType;

        return isNamedSpecifier;
      });

      if (specifiers.length < 2) {
        return;
      }

      const orderedSpecifiers = [...specifiers].sort(compareSpecifiers(node));

      if (getAreSpecifiersOrdered(specifiers, orderedSpecifiers)) {
        return;
      }

      const braceTokens = getBraceTokens(node);

      if (braceTokens === null) {
        return;
      }

      const { closeBrace, openBrace } = braceTokens;

      context.report({
        node,
        messageId: `orderImportSpecifiers`,
        fix(fixer) {
          const replacement = createSpecifiersReplacement(
            node,
            specifiers,
            orderedSpecifiers,
            openBrace,
            closeBrace,
          );

          if (replacement === null) {
            return null;
          }

          const fix = fixer.replaceTextRange(
            [openBrace.range[1], closeBrace.range[0]],
            replacement,
          );

          return fix;
        },
      });
    };

    return {
      ImportDeclaration(node) {
        reportUnorderedSpecifiers(node, `ImportSpecifier`);
      },

      ExportNamedDeclaration(node) {
        reportUnorderedSpecifiers(node, `ExportSpecifier`);
      },
    };
  },
};
