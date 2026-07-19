const publicTypeVisitors = new Set([
  `TSArrayType`,
  `TSConditionalType`,
  `TSFunctionType`,
  `TSIndexedAccessType`,
  `TSIntersectionType`,
  `TSLiteralType`,
  `TSMappedType`,
  `TSOptionalType`,
  `TSParenthesizedType`,
  `TSPropertySignature`,
  `TSTupleType`,
  `TSTypeAnnotation`,
  `TSTypeLiteral`,
  `TSTypeOperator`,
  `TSTypeParameterInstantiation`,
  `TSTypePredicate`,
  `TSTypeQuery`,
  `TSTypeReference`,
  `TSUnionType`,
]);

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

const collectTypeReferenceNames = (node, names = new Set()) => {
  if (node === null || node === undefined || typeof node !== `object`) {
    return names;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectTypeReferenceNames(item, names);
    }

    return names;
  }

  const typeReferenceName = getTypeReferenceName(node);

  if (typeReferenceName !== null) {
    names.add(typeReferenceName);
  }

  for (const [key, value] of Object.entries(node)) {
    if (
      key === `parent` ||
      key === `loc` ||
      key === `range` ||
      key === `tokens` ||
      key === `comments` ||
      key === `type`
    ) {
      continue;
    }

    if (
      value !== null &&
      typeof value === `object` &&
      (Array.isArray(value) || publicTypeVisitors.has(value.type))
    ) {
      collectTypeReferenceNames(value, names);
    }
  }

  return names;
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

const checkIsExportedVariableDeclarator = (node) => {
  const declaration = node.parent;
  const exportDeclaration = declaration?.parent;
  const result =
    declaration?.type === `VariableDeclaration` &&
    exportDeclaration?.type === `ExportNamedDeclaration`;

  return result;
};

const checkIsExportedFunctionDeclaration = (node) =>
  node.type === `FunctionDeclaration` &&
  node.parent?.type === `ExportNamedDeclaration`;

const checkIsPublicFunctionNode = (node) => {
  if (checkIsExportedFunctionDeclaration(node)) {
    return true;
  }

  const variableDeclarator = node.parent;

  if (variableDeclarator?.type !== `VariableDeclarator`) {
    return false;
  }

  const result = checkIsExportedVariableDeclarator(variableDeclarator);

  return result;
};

const collectFunctionSignatureTypeNames = (node) => {
  const typeNames = new Set();

  for (const parameter of node.params) {
    const identifier = getParameterIdentifier(parameter);
    collectTypeReferenceNames(
      identifier?.typeAnnotation?.typeAnnotation,
      typeNames,
    );
  }

  collectTypeReferenceNames(node.returnType?.typeAnnotation, typeNames);

  const variableDeclarator = node.parent;

  if (variableDeclarator?.type === `VariableDeclarator`) {
    collectTypeReferenceNames(
      variableDeclarator.id.typeAnnotation?.typeAnnotation,
      typeNames,
    );
  }

  return typeNames;
};

const reportPrivateTypeReferences = ({
  context,
  localTypeAliases,
  typeNames,
}) => {
  for (const typeName of typeNames) {
    const typeAlias = localTypeAliases.get(typeName);

    if (typeAlias === undefined || typeAlias.isExported) {
      continue;
    }

    context.report({
      node: typeAlias.node.id,
      messageId: `requirePublicTypeReferenceExport`,
      data: { typeName },
    });
  }
};

export const requirePublicTypeReferenceExportsRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require local types referenced by public APIs to be exported.`,
    },
    schema: [],
    messages: {
      requirePublicTypeReferenceExport: `Export {{ typeName }} because it is referenced by a public API.`,
    },
  },
  create(context) {
    const localTypeAliases = new Map();
    const publicTypeAliasNodes = [];
    const publicFunctionNodes = [];

    return {
      'TSTypeAliasDeclaration'(node) {
        const isExported = node.parent?.type === `ExportNamedDeclaration`;

        localTypeAliases.set(node.id.name, {
          isExported,
          node,
        });

        if (isExported) {
          publicTypeAliasNodes.push(node);
        }
      },

      ':function'(node) {
        if (checkIsPublicFunctionNode(node)) {
          publicFunctionNodes.push(node);
        }
      },

      'Program:exit'() {
        for (const node of publicTypeAliasNodes) {
          const typeNames = collectTypeReferenceNames(node.typeAnnotation);
          reportPrivateTypeReferences({
            context,
            localTypeAliases,
            typeNames,
          });
        }

        for (const node of publicFunctionNodes) {
          const typeNames = collectFunctionSignatureTypeNames(node);
          reportPrivateTypeReferences({
            context,
            localTypeAliases,
            typeNames,
          });
        }
      },
    };
  },
};
