import { getPackageSrcPath, getRuleFilename } from './rule-path-helpers.js';

const getTypeParameterInstantiation = (node) =>
  node.typeArguments ?? node.typeParameters ?? null;

const checkIsZodInferTypeReference = (node, schemaName) => {
  if (node.type !== `TSTypeReference`) {
    return false;
  }

  const typeName = node.typeName;

  if (typeName.type !== `TSQualifiedName`) {
    return false;
  }

  if (typeName.left.type !== `Identifier` || typeName.left.name !== `z`) {
    return false;
  }

  if (typeName.right.type !== `Identifier` || typeName.right.name !== `infer`) {
    return false;
  }

  const typeParameters = getTypeParameterInstantiation(node);
  const firstParameter = typeParameters?.params?.[0];

  if (firstParameter?.type !== `TSTypeQuery`) {
    return false;
  }

  const isZodInferForSchema =
    firstParameter.exprName.type === `Identifier` &&
    firstParameter.exprName.name === schemaName;

  return isZodInferForSchema;
};

const checkTypeContainsZodInferForSchema = (node, schemaName) => {
  if (node === undefined || node === null) {
    return false;
  }

  const isZodInferTypeReference = checkIsZodInferTypeReference(
    node,
    schemaName,
  );

  if (isZodInferTypeReference) {
    return true;
  }

  for (const [key, value] of Object.entries(node)) {
    if (
      key === `parent` ||
      key === `loc` ||
      key === `range` ||
      key === `tokens` ||
      key === `comments`
    ) {
      continue;
    }

    if (Array.isArray(value)) {
      const hasZodInferType = value.some((item) =>
        checkTypeContainsZodInferForSchema(item, schemaName),
      );

      if (hasZodInferType) {
        return true;
      }

      continue;
    }

    if (
      value !== null &&
      typeof value === `object` &&
      typeof value.type === `string`
    ) {
      const hasZodInferType = checkTypeContainsZodInferForSchema(
        value,
        schemaName,
      );

      if (hasZodInferType) {
        return true;
      }
    }
  }

  return false;
};

const checkTypeContainsTypeLiteral = (node) => {
  if (node === undefined || node === null) {
    return false;
  }

  if (node.type === `TSTypeLiteral`) {
    return true;
  }

  for (const [key, value] of Object.entries(node)) {
    if (
      key === `parent` ||
      key === `loc` ||
      key === `range` ||
      key === `tokens` ||
      key === `comments`
    ) {
      continue;
    }

    if (Array.isArray(value)) {
      const hasTypeLiteral = value.some((item) =>
        checkTypeContainsTypeLiteral(item),
      );

      if (hasTypeLiteral) {
        return true;
      }

      continue;
    }

    if (
      value !== null &&
      typeof value === `object` &&
      typeof value.type === `string`
    ) {
      const hasTypeLiteral = checkTypeContainsTypeLiteral(value);

      if (hasTypeLiteral) {
        return true;
      }
    }
  }

  return false;
};

const checkIsZodFactoryCall = (node) => {
  if (node === undefined || node === null) {
    return false;
  }

  if (node.type === `CallExpression`) {
    const callee = node.callee;

    if (
      callee.type === `MemberExpression` &&
      callee.object.type === `Identifier` &&
      callee.object.name === `z`
    ) {
      return true;
    }

    return checkIsZodFactoryCall(callee);
  }

  if (node.type === `MemberExpression`) {
    return checkIsZodFactoryCall(node.object);
  }

  return false;
};

const checkIsSchemaPackageFilename = (filename) => {
  const packageSrcPath = getPackageSrcPath(filename);
  const isSchemaPackageFilename = packageSrcPath?.family === `schemas`;

  return isSchemaPackageFilename;
};

const getImportedSchemaNames = (node) => {
  if (node.type !== `ImportDeclaration`) {
    return [];
  }

  const result = node.specifiers
    .filter((specifier) => specifier.type === `ImportSpecifier`)
    .map((specifier) => specifier.local.name)
    .filter((name) => name.endsWith(`Schema`));

  return result;
};

export const preferSchemaDerivedTypesRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Require schema package types to derive from matching Zod schemas.`,
    },
    schema: [],
    messages: {
      preferSchemaDerivedType: `Derive {{ typeName }} from {{ schemaName }} with z.infer<typeof {{ schemaName }}> instead of duplicating the schema shape.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isSchemaPackageFilename = checkIsSchemaPackageFilename(filename);

    if (!isSchemaPackageFilename) {
      return {};
    }

    const schemaNames = new Set();
    const typeAliasNodes = [];

    return {
      'ImportDeclaration'(node) {
        for (const schemaName of getImportedSchemaNames(node)) {
          schemaNames.add(schemaName);
        }
      },

      'VariableDeclarator'(node) {
        const isSchemaIdentifier =
          node.id.type === `Identifier` && node.id.name.endsWith(`Schema`);

        if (!isSchemaIdentifier) {
          return;
        }

        const isZodFactoryCall = checkIsZodFactoryCall(node.init);

        if (!isZodFactoryCall) {
          return;
        }

        schemaNames.add(node.id.name);
      },

      'TSTypeAliasDeclaration'(node) {
        typeAliasNodes.push(node);
      },

      'Program:exit'() {
        for (const node of typeAliasNodes) {
          const typeName = node.id.name;
          const schemaName = `${typeName}Schema`;

          if (!schemaNames.has(schemaName)) {
            continue;
          }

          const containsZodInferForSchema = checkTypeContainsZodInferForSchema(
            node.typeAnnotation,
            schemaName,
          );

          if (containsZodInferForSchema) {
            continue;
          }

          const containsTypeLiteral = checkTypeContainsTypeLiteral(
            node.typeAnnotation,
          );

          if (!containsTypeLiteral) {
            continue;
          }

          context.report({
            node,
            messageId: `preferSchemaDerivedType`,
            data: {
              schemaName,
              typeName,
            },
          });
        }
      },
    };
  },
};
