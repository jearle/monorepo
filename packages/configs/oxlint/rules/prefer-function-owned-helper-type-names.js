const helperTypeSuffixes = new Set([`Context`, `Options`, `Props`, `Result`]);

const suffixPattern = /.+(Context|Options|Props|Result)$/u;
const templatePlaceholderPattern = /__[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:__)?/u;

const getPascalCaseName = (name) => {
  const result = name
    .replaceAll(/[^A-Za-z0-9]+([A-Za-z0-9])/gu, (_, character) =>
      character.toUpperCase(),
    )
    .replace(/^[a-z]/u, (character) => character.toUpperCase());

  return result;
};

const isFunctionNode = (node) => {
  const result =
    node?.type === `ArrowFunctionExpression` ||
    node?.type === `FunctionExpression` ||
    node?.type === `FunctionDeclaration`;

  return result;
};

const getTypeReferenceName = (node) => {
  if (node?.type !== `TSTypeReference`) {
    return null;
  }

  const typeName = node.typeName;

  if (typeName.type !== `Identifier`) {
    return null;
  }

  return typeName.name;
};

const getParameterIdentifier = (node) => {
  if (node.type === `Identifier`) {
    return node;
  }

  if (node.type === `AssignmentPattern` && node.left.type === `Identifier`) {
    return node.left;
  }

  return null;
};

const getParameterTypeName = (node) => {
  const identifier = getParameterIdentifier(node);
  const typeAnnotation = identifier?.typeAnnotation?.typeAnnotation;
  const result = getTypeReferenceName(typeAnnotation);

  return result;
};

const getReturnTypeName = (node) => {
  const typeAnnotation = node.returnType?.typeAnnotation;
  const result = getTypeReferenceName(typeAnnotation);

  return result;
};

const getFunctionName = (node) => {
  const parent = node.parent;

  if (node.type === `FunctionDeclaration`) {
    return node.id?.name ?? null;
  }

  if (
    parent?.type === `VariableDeclarator` &&
    parent.id.type === `Identifier`
  ) {
    return parent.id.name;
  }

  if (parent?.type === `Property`) {
    if (parent.key.type === `Identifier`) {
      return parent.key.name;
    }

    if (parent.key.type === `Literal` && typeof parent.key.value === `string`) {
      return parent.key.value;
    }
  }

  return null;
};

const checkFunctionNode = (context, localHelperTypeNames, node) => {
  const functionName = getFunctionName(node);

  if (functionName === null) {
    return;
  }

  const functionTypeName = getPascalCaseName(functionName);

  for (const parameter of node.params) {
    const typeName = getParameterTypeName(parameter);
    const suffix = typeName?.match(suffixPattern)?.[1];

    if (
      typeName === undefined ||
      typeName === null ||
      suffix === undefined ||
      !localHelperTypeNames.has(typeName)
    ) {
      continue;
    }

    const expectedTypeName = `${functionTypeName}${suffix}`;

    if (typeName === expectedTypeName) {
      continue;
    }

    const identifier = getParameterIdentifier(parameter);

    context.report({
      node: identifier ?? parameter,
      messageId: `preferFunctionOwnedHelperTypeName`,
    });
  }

  const returnTypeName = getReturnTypeName(node);
  const returnTypeSuffix = returnTypeName?.match(suffixPattern)?.[1];

  if (
    returnTypeName === undefined ||
    returnTypeName === null ||
    returnTypeSuffix === undefined ||
    !localHelperTypeNames.has(returnTypeName)
  ) {
    return;
  }

  const expectedReturnTypeName = `${functionTypeName}${returnTypeSuffix}`;

  if (returnTypeName === expectedReturnTypeName) {
    return;
  }

  context.report({
    node: node.returnType,
    messageId: `preferFunctionOwnedHelperTypeName`,
  });
};

export const preferFunctionOwnedHelperTypeNamesRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Require local function-owned helper type names to match their owner function.`,
    },
    schema: [],
    messages: {
      preferFunctionOwnedHelperTypeName: `Function-owned helper type names must match the owning function and suffix.`,
    },
  },
  create(context) {
    const localHelperTypeNames = new Set();
    const functionNodes = [];

    return {
      'TSTypeAliasDeclaration'(node) {
        if (node.typeParameters != null) {
          return;
        }

        if (templatePlaceholderPattern.test(node.id.name)) {
          return;
        }

        const suffix = node.id.name.match(suffixPattern)?.[1];

        if (suffix === undefined || !helperTypeSuffixes.has(suffix)) {
          return;
        }

        localHelperTypeNames.add(node.id.name);
      },

      ':function'(node) {
        if (!isFunctionNode(node)) {
          return;
        }

        functionNodes.push(node);
      },

      'Program:exit'() {
        for (const node of functionNodes) {
          checkFunctionNode(context, localHelperTypeNames, node);
        }
      },
    };
  },
};
