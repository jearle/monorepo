const isInsideDeclaredModuleDeclaration = (node) => {
  let currentNode = node.parent;
  let isInsideModuleDeclaration = false;
  let isInsideDeclaredModuleDeclaration = false;

  while (currentNode != null) {
    if (currentNode.type === `TSModuleDeclaration`) {
      isInsideModuleDeclaration = true;
      isInsideDeclaredModuleDeclaration =
        isInsideDeclaredModuleDeclaration || currentNode.declare === true;
    }

    currentNode = currentNode.parent;
  }

  const result = isInsideModuleDeclaration && isInsideDeclaredModuleDeclaration;

  return result;
};

const createTypeAliasText = (sourceCode, node) => {
  const typeParametersText =
    node.typeParameters == null ? `` : sourceCode.getText(node.typeParameters);
  const bodyText = sourceCode.getText(node.body);
  const extendedTypesText = node.extends
    .map((extendedType) => sourceCode.getText(extendedType))
    .join(` & `);
  const aliasValueText =
    extendedTypesText === `` ? bodyText : `${extendedTypesText} & ${bodyText}`;
  const result = `type ${node.id.name}${typeParametersText} = ${aliasValueText};`;

  return result;
};

export const preferTypeAliasesRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Use type aliases instead of interfaces.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      preferTypeAliases: `Use type aliases instead of interfaces.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      TSInterfaceDeclaration(node) {
        if (isInsideDeclaredModuleDeclaration(node)) {
          return;
        }

        context.report({
          node,
          messageId: `preferTypeAliases`,
          fix(fixer) {
            const typeAliasText = createTypeAliasText(sourceCode, node);
            const result = fixer.replaceText(node, typeAliasText);

            return result;
          },
        });
      },
    };
  },
};
