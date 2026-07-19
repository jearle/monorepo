const createArrowFunctionText = (sourceCode, node) => {
  if (node.generator) {
    return null;
  }

  const asyncText = node.async ? `async ` : ``;
  const typeParametersText =
    node.typeParameters == null ? `` : sourceCode.getText(node.typeParameters);
  const parametersText = node.params
    .map((parameter) => sourceCode.getText(parameter))
    .join(`, `);
  const returnTypeText =
    node.returnType == null ? `` : sourceCode.getText(node.returnType);
  const bodyText = sourceCode.getText(node.body);
  const result = `${asyncText}${typeParametersText}(${parametersText})${returnTypeText} => ${bodyText}`;

  return result;
};

const createExportedConstArrowFunctionText = (sourceCode, node) => {
  if (node.id === null) {
    return null;
  }

  const arrowFunctionText = createArrowFunctionText(sourceCode, node);

  if (arrowFunctionText === null) {
    return null;
  }

  const result = `export const ${node.id.name} = ${arrowFunctionText};`;
  return result;
};

export const preferExportedConstArrowFunctionsRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Require exported functions to use inline export const arrow declarations.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      preferExportedConstArrowFunction: `Exported functions must use inline export const arrow declarations.`,
      preferNamedExport: `Do not use default function exports; use a named export const arrow instead.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      ExportDefaultDeclaration(node) {
        const declaration = node.declaration;

        if (
          declaration.type !== `FunctionDeclaration` &&
          declaration.type !== `FunctionExpression` &&
          declaration.type !== `ArrowFunctionExpression`
        ) {
          return;
        }

        context.report({
          node,
          messageId: `preferNamedExport`,
        });
      },

      ExportNamedDeclaration(node) {
        const declaration = node.declaration;

        if (declaration?.type === `FunctionDeclaration`) {
          context.report({
            node: declaration,
            messageId: `preferExportedConstArrowFunction`,
            fix(fixer) {
              const exportedConstArrowFunctionText =
                createExportedConstArrowFunctionText(sourceCode, declaration);

              if (exportedConstArrowFunctionText === null) {
                return null;
              }

              const result = fixer.replaceText(
                node,
                exportedConstArrowFunctionText,
              );

              return result;
            },
          });

          return;
        }

        if (declaration?.type !== `VariableDeclaration`) {
          return;
        }

        for (const declarator of declaration.declarations) {
          if (declarator.init?.type !== `FunctionExpression`) {
            continue;
          }

          context.report({
            node: declarator.init,
            messageId: `preferExportedConstArrowFunction`,
            fix(fixer) {
              const arrowFunctionText = createArrowFunctionText(
                sourceCode,
                declarator.init,
              );

              if (arrowFunctionText === null) {
                return null;
              }

              const result = fixer.replaceText(
                declarator.init,
                arrowFunctionText,
              );

              return result;
            },
          });
        }
      },
    };
  },
};
