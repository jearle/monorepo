const parameterRoleOrder = new Map([
  [`Context`, 0],
  [`Props`, 1],
  [`Options`, 2],
]);

const parameterRoleNames = new Map([
  [`Context`, `ctx`],
  [`Props`, `props`],
  [`Options`, `options`],
]);

const parameterNameRoles = new Map([
  [`ctx`, `Context`],
  [`props`, `Props`],
  [`options`, `Options`],
]);

const helperTypeSuffixPattern = /.+(Context|Options|Props)$/u;

export const getPropertyName = (node) => {
  if (node.key.type === `Identifier`) {
    return node.key.name;
  }

  if (node.key.type === `Literal` && typeof node.key.value === `string`) {
    return node.key.value;
  }

  if (
    node.key.type === `TemplateLiteral` &&
    node.key.expressions.length === 0
  ) {
    const [quasi = null] = node.key.quasis;
    const result = quasi?.value?.cooked ?? null;

    return result;
  }

  return null;
};

export const checkIsDirectPropsTypeMember = (node) => {
  const typeLiteral = node.parent;
  const typeAlias = typeLiteral?.parent;
  const typeAliasName = typeAlias?.id?.name;
  const result =
    typeLiteral?.type === `TSTypeLiteral` &&
    typeAlias?.type === `TSTypeAliasDeclaration` &&
    typeAlias.typeAnnotation === typeLiteral &&
    typeAliasName?.endsWith(`Props`) === true;

  return result;
};

const getQualifiedTypeReferenceName = (node) => {
  if (node.type === `Identifier`) {
    return node.name;
  }

  if (node.type === `TSQualifiedName`) {
    const result = getQualifiedTypeReferenceName(node.right);

    return result;
  }

  return null;
};

const getTypeReferenceName = (node) => {
  if (node?.type !== `TSTypeReference`) {
    return null;
  }

  const result = getQualifiedTypeReferenceName(node.typeName);

  return result;
};

export const getPropertyTypeReferenceName = (node) => {
  const typeAnnotation = node.typeAnnotation?.typeAnnotation ?? null;
  const result = getTypeReferenceName(typeAnnotation);

  return result;
};

export const getParameterIdentifier = (node) => {
  if (node.type === `Identifier`) {
    return node;
  }

  if (node.type === `AssignmentPattern` && node.left.type === `Identifier`) {
    return node.left;
  }

  return null;
};

const getParameterTypeNode = (node) => {
  const typedParameter = node.type === `AssignmentPattern` ? node.left : node;
  const result = typedParameter.typeAnnotation?.typeAnnotation ?? null;

  return result;
};

const getParameterTypeReferenceName = (node) => {
  if (node?.type === `TSParenthesizedType`) {
    const result = getParameterTypeReferenceName(node.typeAnnotation);

    return result;
  }

  const result = getTypeReferenceName(node);

  return result;
};

export const getParameterTypeRole = (node) => {
  const typeName = getParameterTypeReferenceName(getParameterTypeNode(node));
  const result = typeName?.match(helperTypeSuffixPattern)?.[1] ?? null;

  return result;
};

export const getParameterRole = (node) => {
  const identifier = getParameterIdentifier(node);
  const typeRole = getParameterTypeRole(node);
  const nameRole =
    identifier === undefined || identifier === null
      ? null
      : (parameterNameRoles.get(identifier.name) ?? null);
  const result = typeRole ?? nameRole;

  return result;
};

export const getExpectedParameterName = (role) => parameterRoleNames.get(role);

export const getParameterRoleOrder = (role) => parameterRoleOrder.get(role);

const getFunctionName = (node) => {
  if (node.type === `FunctionDeclaration`) {
    return node.id?.name ?? null;
  }

  const parent = node.parent;

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

export const checkIsNamedFunctionNode = (node) => {
  const functionName = getFunctionName(node);
  const result =
    node.type === `FunctionDeclaration` ||
    functionName !== null ||
    node.parent?.type === `Property`;

  return result;
};
