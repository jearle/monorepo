const jotaiHookNamePattern = /^use[A-Z].*State$/u;

const getFunctionBody = (node) => {
  if (node.type === `FunctionDeclaration`) {
    return node.body;
  }

  const isArrowFunctionDeclarator =
    node.type === `VariableDeclarator` &&
    node.init?.type === `ArrowFunctionExpression`;

  if (isArrowFunctionDeclarator) {
    return node.init.body.type === `BlockStatement` ? node.init.body : null;
  }

  return null;
};

const getExportedFunctionName = (node) => {
  if (node.type !== `ExportNamedDeclaration`) {
    return null;
  }

  const declaration = node.declaration;

  if (declaration?.type === `FunctionDeclaration`) {
    return declaration.id?.name ?? null;
  }

  if (declaration?.type !== `VariableDeclaration`) {
    return null;
  }

  if (declaration.declarations.length !== 1) {
    return null;
  }

  const [variableDeclarator] = declaration.declarations;

  return variableDeclarator?.id.type === `Identifier`
    ? variableDeclarator.id.name
    : null;
};

const getExportedFunctionBody = (node) => {
  const declaration = node.declaration;

  if (declaration?.type === `FunctionDeclaration`) {
    return getFunctionBody(declaration);
  }

  if (declaration?.type !== `VariableDeclaration`) {
    return null;
  }

  if (declaration.declarations.length !== 1) {
    return null;
  }

  const [variableDeclarator] = declaration.declarations;

  return variableDeclarator === undefined
    ? null
    : getFunctionBody(variableDeclarator);
};

const checkIsUseAtomValueCall = (node) =>
  node?.type === `CallExpression` &&
  node.callee.type === `Identifier` &&
  node.callee.name === `useAtomValue`;

const getHookResultPropertyNames = (resultDeclaration) => {
  if (resultDeclaration?.init?.type !== `ObjectExpression`) {
    return null;
  }

  const result = new Set();

  for (const property of resultDeclaration.init.properties) {
    if (property.type === `SpreadElement`) {
      continue;
    }

    if (property.key.type === `Identifier`) {
      result.add(property.key.name);
      continue;
    }

    if (
      property.key.type === `Literal` &&
      typeof property.key.value === `string`
    ) {
      result.add(property.key.value);
    }
  }

  return result;
};

const getTopLevelHookShape = (body) => {
  const atomValueNames = [];
  let resultDeclaration = null;
  let returnsResult = false;

  for (const statement of body.body) {
    if (statement.type === `ReturnStatement`) {
      returnsResult =
        statement.argument?.type === `Identifier` &&
        statement.argument.name === `result`;
      continue;
    }

    if (statement.type !== `VariableDeclaration`) {
      continue;
    }

    for (const declaration of statement.declarations) {
      if (declaration.id.type !== `Identifier`) {
        continue;
      }

      if (declaration.id.name === `result`) {
        resultDeclaration = declaration;
        continue;
      }

      const isUseAtomValueCall = checkIsUseAtomValueCall(declaration.init);

      if (isUseAtomValueCall) {
        atomValueNames.push(declaration.id.name);
      }
    }
  }

  const result = {
    atomValueNames,
    resultDeclaration,
    returnsResult,
  };

  return result;
};

export const requireJotaiHookResultObjectRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require public Jotai state hooks to return a named result object containing atom values.`,
    },
    schema: [],
    messages: {
      requireJotaiHookResultObject: `Public Jotai state hooks must assign a result object and return result.`,
      requireJotaiHookResultProperty: `Public Jotai state hook result objects must include {{ propertyName }} when that atom value is read.`,
      requireJotaiHookErrorProperty: `Public Jotai state hook result objects must include an error property.`,
      requireJotaiHookLoadingProperty: `Public Jotai state hook result objects must include an isLoading property.`,
    },
  },
  create(context) {
    return {
      ExportNamedDeclaration(node) {
        const functionName = getExportedFunctionName(node);
        const isJotaiStateHook =
          functionName !== null && jotaiHookNamePattern.test(functionName);

        if (!isJotaiStateHook) {
          return;
        }

        const body = getExportedFunctionBody(node);

        if (body === null) {
          return;
        }

        const { atomValueNames, resultDeclaration, returnsResult } =
          getTopLevelHookShape(body);

        const hasNamedResultObject =
          resultDeclaration !== null && returnsResult;

        if (!hasNamedResultObject) {
          if (atomValueNames.length > 0) {
            context.report({
              node,
              messageId: `requireJotaiHookResultObject`,
            });
          }

          return;
        }

        const resultPropertyNames =
          getHookResultPropertyNames(resultDeclaration);

        if (resultPropertyNames === null) {
          context.report({
            node: resultDeclaration,
            messageId: `requireJotaiHookResultObject`,
          });
          return;
        }

        for (const atomValueName of atomValueNames) {
          const hasResultProperty = resultPropertyNames.has(atomValueName);

          if (hasResultProperty) {
            continue;
          }

          context.report({
            node: resultDeclaration,
            messageId: `requireJotaiHookResultProperty`,
            data: {
              propertyName: atomValueName,
            },
          });
        }

        const hasErrorProperty = resultPropertyNames.has(`error`);

        if (hasErrorProperty === false) {
          context.report({
            node: resultDeclaration,
            messageId: `requireJotaiHookErrorProperty`,
          });
        }

        const hasLoadingProperty = resultPropertyNames.has(`isLoading`);

        if (hasLoadingProperty === false) {
          context.report({
            node: resultDeclaration,
            messageId: `requireJotaiHookLoadingProperty`,
          });
        }
      },
    };
  },
};
