import {
  checkIsCallableType,
  resolveLocalTypeAlias,
} from './prefer-check-predicate-callable-types.js';

export const predicateNamePattern = /^(?:is|has|can|should)(?:$|[A-Z0-9])/u;
export const predicateFunctionNamePattern =
  /^check(?:Is|Has|Can|Should)(?:$|[A-Z0-9])/u;

export const createBindingIdentifiers = (node) => {
  if (node.type === `Identifier`) {
    return [node];
  }

  if (node.type === `AssignmentPattern` || node.type === `RestElement`) {
    const result = createBindingIdentifiers(
      node.type === `AssignmentPattern` ? node.left : node.argument,
    );

    return result;
  }

  if (node.type === `ArrayPattern`) {
    const result = node.elements.flatMap((element) => {
      const identifiers =
        element === null ? [] : createBindingIdentifiers(element);

      return identifiers;
    });

    return result;
  }

  if (node.type === `ObjectPattern`) {
    const result = node.properties.flatMap((property) => {
      const identifiers = createBindingIdentifiers(
        property.type === `RestElement` ? property.argument : property.value,
      );

      return identifiers;
    });

    return result;
  }

  return [];
};

export const getPropertyName = (node) => {
  if (node.type === `Identifier`) {
    return node.name;
  }

  if (node.type === `Literal` && typeof node.value === `string`) {
    return node.value;
  }

  return null;
};

const getTupleElementType = (node) => {
  let typeNode = node;

  while (
    typeNode?.type === `TSNamedTupleMember` ||
    typeNode?.type === `TSOptionalType` ||
    typeNode?.type === `TSRestType`
  ) {
    typeNode = typeNode.elementType ?? typeNode.typeAnnotation;
  }

  return typeNode ?? null;
};

const getObjectPropertyType = (typeNode, propertyName, callableTypeAliases) => {
  const resolvedType = resolveLocalTypeAlias(typeNode, callableTypeAliases);

  if (resolvedType?.type !== `TSTypeLiteral` || propertyName === null) {
    return null;
  }

  const member = resolvedType.members.find((value) => {
    const memberName = `key` in value ? getPropertyName(value.key) : null;
    const isMatch = memberName === propertyName;

    return isMatch;
  });

  if (member?.type === `TSMethodSignature`) {
    return member;
  }

  return member?.type === `TSPropertySignature`
    ? (member.typeAnnotation ?? null)
    : null;
};

export const checkIsTypedCallableBinding = (
  pattern,
  identifier,
  typeNode,
  callableTypeAliases,
) => {
  if (pattern.type === `Identifier`) {
    const result =
      pattern === identifier &&
      checkIsCallableType(
        typeNode ?? pattern.typeAnnotation,
        callableTypeAliases,
      );

    return result;
  }

  if (pattern.type === `AssignmentPattern`) {
    const result = checkIsTypedCallableBinding(
      pattern.left,
      identifier,
      typeNode,
      callableTypeAliases,
    );

    return result;
  }

  if (pattern.type === `ObjectPattern`) {
    const rootType = typeNode ?? pattern.typeAnnotation;

    for (const property of pattern.properties) {
      if (property.type === `RestElement`) {
        continue;
      }

      const propertyType = getObjectPropertyType(
        rootType,
        getPropertyName(property.key),
        callableTypeAliases,
      );

      if (
        checkIsTypedCallableBinding(
          property.value,
          identifier,
          propertyType,
          callableTypeAliases,
        )
      ) {
        return true;
      }
    }

    return false;
  }

  if (pattern.type === `ArrayPattern`) {
    const rootType = resolveLocalTypeAlias(
      typeNode ?? pattern.typeAnnotation,
      callableTypeAliases,
    );

    if (rootType?.type !== `TSTupleType`) {
      return false;
    }

    for (const [index, element] of pattern.elements.entries()) {
      if (element === null) {
        continue;
      }

      const elementType = getTupleElementType(rootType.elementTypes[index]);

      if (
        checkIsTypedCallableBinding(
          element,
          identifier,
          elementType,
          callableTypeAliases,
        )
      ) {
        return true;
      }
    }
  }

  return false;
};
