const statusConstantNamePattern =
  /^(?:STATUS_[A-Z0-9_]+|[A-Z0-9_]+_STATUS_[A-Z0-9_]+)$/u;

const upperSnakeCaseValuePattern = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/u;

const isDirectExportedConst = (node) => {
  const declaration = node.parent;
  const exportDeclaration = declaration?.parent;
  const result =
    declaration?.type === `VariableDeclaration` &&
    declaration.kind === `const` &&
    exportDeclaration?.type === `ExportNamedDeclaration`;

  return result;
};

const unwrapExpression = (node) => {
  if (
    node?.type === `TSAsExpression` ||
    node?.type === `TSTypeAssertion` ||
    node?.type === `TSNonNullExpression`
  ) {
    return unwrapExpression(node.expression);
  }

  return node;
};

const getStaticStringValue = (node) => {
  const expression = unwrapExpression(node);

  if (expression?.type === `Literal` && typeof expression.value === `string`) {
    return expression.value;
  }

  if (
    expression?.type === `TemplateLiteral` &&
    expression.expressions.length === 0
  ) {
    return expression.quasis[0]?.value.cooked ?? null;
  }

  return null;
};

const getStaticStringExpression = (node) => {
  const expression = unwrapExpression(node);

  if (expression?.type === `Literal` && typeof expression.value === `string`) {
    return expression;
  }

  if (
    expression?.type === `TemplateLiteral` &&
    expression.expressions.length === 0
  ) {
    return expression;
  }

  return null;
};

const createUpperSnakeCaseValue = (value) => {
  const result = value
    .replace(/[^A-Za-z0-9]+/gu, `_`)
    .replace(/([a-z0-9])([A-Z])/gu, `$1_$2`)
    .replace(/_+/gu, `_`)
    .replace(/^_|_$/gu, ``)
    .toUpperCase();

  return result;
};

export const requireUppercaseStatusValuesRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require exported status constant string values to use UPPER_SNAKE_CASE.`,
    },
    schema: [
      {
        type: `object`,
        properties: {
          allowedConstantValues: {
            type: `object`,
            additionalProperties: {
              type: `string`,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: `code`,
    messages: {
      requireUppercaseStatusValues: `Status constant values must use UPPER_SNAKE_CASE.`,
    },
  },
  create(context) {
    const options = context.options[0] ?? {};
    const allowedConstantValues = new Map(
      Object.entries(options.allowedConstantValues ?? {}),
    );

    return {
      VariableDeclarator(node) {
        if (
          node.id.type !== `Identifier` ||
          !statusConstantNamePattern.test(node.id.name) ||
          !isDirectExportedConst(node)
        ) {
          return;
        }

        const value = getStaticStringValue(node.init);
        const staticStringExpression = getStaticStringExpression(node.init);
        const allowedValue = allowedConstantValues.get(node.id.name);

        if (
          value === null ||
          value === allowedValue ||
          upperSnakeCaseValuePattern.test(value)
        ) {
          return;
        }

        const reportDescriptor = {
          node: staticStringExpression ?? node.init,
          messageId: `requireUppercaseStatusValues`,
        };

        if (staticStringExpression !== null) {
          reportDescriptor.fix = (fixer) => {
            const uppercaseValue = createUpperSnakeCaseValue(value);
            const result = fixer.replaceText(
              staticStringExpression,
              `\`${uppercaseValue}\``,
            );

            return result;
          };
        }

        context.report(reportDescriptor);
      },
    };
  },
};
