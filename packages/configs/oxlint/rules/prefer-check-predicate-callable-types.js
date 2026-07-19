const typeScriptExpressionWrapperTypes = new Set([
  `TSAsExpression`,
  `TSInstantiationExpression`,
  `TSNonNullExpression`,
  `TSSatisfiesExpression`,
  `TSTypeAssertion`,
]);

export const checkIsFunctionNode = (node) => {
  const result =
    node?.type === `ArrowFunctionExpression` ||
    node?.type === `FunctionExpression` ||
    node?.type === `FunctionDeclaration`;

  return result;
};

const unwrapExpression = (node) => {
  let expression = node;

  while (
    expression?.type === `ChainExpression` ||
    expression?.type === `ParenthesizedExpression` ||
    typeScriptExpressionWrapperTypes.has(expression?.type)
  ) {
    expression = expression.expression;
  }

  return expression ?? null;
};

export const unwrapType = (node) => {
  const typeNode =
    node?.type === `TSTypeAnnotation` ? node.typeAnnotation : node;
  const result =
    typeNode?.type === `TSParenthesizedType`
      ? unwrapType(typeNode.typeAnnotation)
      : (typeNode ?? null);

  return result;
};

const getTypeReferenceName = (node) => {
  const typeNode = unwrapType(node);
  const result =
    typeNode?.type === `TSTypeReference` &&
    typeNode.typeName.type === `Identifier`
      ? typeNode.typeName.name
      : null;

  return result;
};

export const resolveLocalTypeAlias = (
  node,
  callableTypeAliases,
  visitedAliases = new Set(),
) => {
  const typeNode = unwrapType(node);
  const typeName = getTypeReferenceName(typeNode);

  if (typeName === null) {
    return typeNode;
  }

  if (visitedAliases.has(typeName)) {
    return null;
  }

  const aliasType = callableTypeAliases.get(typeName);

  if (aliasType === undefined) {
    return typeNode;
  }

  const nextVisitedAliases = new Set([...visitedAliases, typeName]);
  const result = resolveLocalTypeAlias(
    aliasType,
    callableTypeAliases,
    nextVisitedAliases,
  );

  return result;
};

export const checkIsCallableType = (
  node,
  callableTypeAliases,
  visitedAliases = new Set(),
) => {
  const typeNode = unwrapType(node);

  if (typeNode === null) {
    return false;
  }

  if (typeNode.type === `TSFunctionType`) {
    return true;
  }

  if (
    typeNode.type === `TSCallSignatureDeclaration` ||
    typeNode.type === `TSMethodSignature`
  ) {
    return true;
  }

  if (typeNode.type === `TSTypeLiteral`) {
    const result = typeNode.members.some(
      (member) => member.type === `TSCallSignatureDeclaration`,
    );

    return result;
  }

  if (typeNode.type === `TSIntersectionType`) {
    const result = typeNode.types.some((value) =>
      checkIsCallableType(value, callableTypeAliases, visitedAliases),
    );

    return result;
  }

  if (typeNode.type === `TSUnionType`) {
    const result =
      typeNode.types.length > 0 &&
      typeNode.types.every((value) =>
        checkIsCallableType(value, callableTypeAliases, visitedAliases),
      );

    return result;
  }

  const typeName = getTypeReferenceName(typeNode);

  if (typeName === null || visitedAliases.has(typeName)) {
    return false;
  }

  const aliasType = callableTypeAliases.get(typeName);

  if (aliasType === undefined) {
    return false;
  }

  const nextVisitedAliases = new Set([...visitedAliases, typeName]);
  const result = checkIsCallableType(
    aliasType,
    callableTypeAliases,
    nextVisitedAliases,
  );

  return result;
};

export const checkHasCallableInitializer = (node, callableTypeAliases) => {
  if (checkIsFunctionNode(unwrapExpression(node))) {
    return true;
  }

  const hasExplicitType =
    node?.type === `TSAsExpression` ||
    node?.type === `TSSatisfiesExpression` ||
    node?.type === `TSTypeAssertion`;
  const result =
    hasExplicitType &&
    checkIsCallableType(node.typeAnnotation, callableTypeAliases);

  return result;
};

export const getExplicitInitializerType = (node) => {
  if (
    node?.type === `TSAsExpression` ||
    node?.type === `TSSatisfiesExpression` ||
    node?.type === `TSTypeAssertion`
  ) {
    return node.typeAnnotation;
  }

  if (
    node?.type === `ChainExpression` ||
    node?.type === `ParenthesizedExpression` ||
    node?.type === `TSInstantiationExpression` ||
    node?.type === `TSNonNullExpression`
  ) {
    const result = getExplicitInitializerType(node.expression);

    return result;
  }

  return null;
};
