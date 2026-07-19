import fs from 'node:fs';
import path from 'node:path';

import {
  getRuleFilename,
  getSourceFileStem,
  toKebabCase,
} from './rule-path-helpers.js';

const helperTypeNamePattern =
  /^(?<owner>.+)(?<suffix>Context|Options|Props|Result)$/u;
const sharedTypeSuffixes = new Set([`Context`, `Options`, `Result`]);

const checkIsTypesFile = (filename) => getSourceFileStem(filename) === `types`;

const getTypePlacement = (typeName) => {
  const match = typeName.match(helperTypeNamePattern);

  if (match?.groups === undefined) {
    return null;
  }

  const result = {
    ownerName: match.groups.owner,
    suffix: match.groups.suffix,
  };

  return result;
};

const checkHasOwnerImplementationFile = (filename, ownerName) => {
  const ownerStem = toKebabCase(ownerName);
  const directory = path.posix.dirname(filename);
  const ownerFilenames = [
    path.posix.join(directory, `${ownerStem}.ts`),
    path.posix.join(directory, `${ownerStem}.tsx`),
    path.posix.join(directory, `${ownerName}.ts`),
    path.posix.join(directory, `${ownerName}.tsx`),
  ];
  const result = ownerFilenames.some((ownerFilename) =>
    fs.existsSync(ownerFilename),
  );

  return result;
};

const getTopLevelStatement = (node) => {
  let currentNode = node;

  while (
    currentNode.parent !== undefined &&
    currentNode.parent.type !== `Program`
  ) {
    currentNode = currentNode.parent;
  }

  if (currentNode.parent?.type !== `Program`) {
    return null;
  }

  return currentNode;
};

const getPreviousTopLevelStatement = (node) => {
  const statement = getTopLevelStatement(node);

  if (statement === null) {
    return null;
  }

  const body = statement.parent.body;
  const statementIndex = body.indexOf(statement);

  if (statementIndex <= 0) {
    return null;
  }

  const result = body[statementIndex - 1];

  return result;
};

const checkIsImmediatelyBefore = ({ node, previousNode }) => {
  const statement = getTopLevelStatement(node);
  const previousStatement = getTopLevelStatement(previousNode);
  const result =
    statement !== null &&
    previousStatement !== null &&
    getPreviousTopLevelStatement(node) === previousStatement;

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

const checkIsReturnTypeAlias = (node) => {
  const typeReferenceName = getTypeReferenceName(node.typeAnnotation);
  const result = typeReferenceName === `ReturnType`;

  return result;
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
      key === `type`
    ) {
      continue;
    }

    collectTypeReferenceNames(value, names);
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

const getParameterTypeName = (node) => {
  const identifier = getParameterIdentifier(node);
  const typeAnnotation = identifier?.typeAnnotation?.typeAnnotation;
  const result = getTypeReferenceName(typeAnnotation);

  return result;
};

const getSignatureTypeNames = (node) => {
  const typeNames = new Set();

  for (const parameter of node.params) {
    const identifier = getParameterIdentifier(parameter);
    const typeAnnotation = identifier?.typeAnnotation?.typeAnnotation;

    collectTypeReferenceNames(typeAnnotation, typeNames);
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

const getPascalCaseName = (name) => {
  const result = name
    .replaceAll(/[^A-Za-z0-9]+([A-Za-z0-9])/gu, (_, character) =>
      character.toUpperCase(),
    )
    .replace(/^[a-z]/u, (character) => character.toUpperCase());

  return result;
};

const getExportedFunctionName = (node) => {
  if (
    node.type === `FunctionDeclaration` &&
    node.parent?.type === `ExportNamedDeclaration`
  ) {
    return node.id?.name ?? null;
  }

  const variableDeclarator = node.parent;

  if (
    variableDeclarator?.type !== `VariableDeclarator` ||
    variableDeclarator.id.type !== `Identifier`
  ) {
    return null;
  }

  const variableDeclaration = variableDeclarator.parent;

  if (variableDeclaration?.parent?.type !== `ExportNamedDeclaration`) {
    return null;
  }

  return variableDeclarator.id.name;
};

const checkFunctionNode = (context, isTypesFile, localTypeAliases, node) => {
  const functionName = getExportedFunctionName(node);

  if (functionName === null) {
    return;
  }

  const expectedPropsTypeName = `${getPascalCaseName(functionName)}Props`;
  const propsType = localTypeAliases.get(expectedPropsTypeName);

  if (propsType?.isExported === false) {
    const usesExpectedPropsType = node.params.some((parameter) => {
      const typeName = getParameterTypeName(parameter);
      const result = typeName === expectedPropsTypeName;

      return result;
    });

    if (usesExpectedPropsType) {
      context.report({
        node: propsType.node.id,
        messageId: `requirePublicPropsExport`,
      });
    }
  }

  if (propsType?.isExported) {
    const usesExpectedPropsType = node.params.some((parameter) => {
      const typeName = getParameterTypeName(parameter);
      const result = typeName === expectedPropsTypeName;

      return result;
    });

    if (usesExpectedPropsType) {
      const isImmediatelyBefore = checkIsImmediatelyBefore({
        node,
        previousNode: propsType.node,
      });

      if (isImmediatelyBefore === false) {
        context.report({
          node: propsType.node.id,
          messageId: `requirePropsAdjacency`,
        });
      }
    }
  }

  if (isTypesFile) {
    return;
  }

  const signatureTypeNames = getSignatureTypeNames(node);

  for (const typeName of signatureTypeNames) {
    const typeAlias = localTypeAliases.get(typeName);

    if (
      typeAlias === undefined ||
      typeAlias.isExported ||
      sharedTypeSuffixes.has(typeAlias.placement.suffix) === false
    ) {
      continue;
    }

    if (
      typeAlias.placement.suffix === `Result` &&
      typeAlias.isReturnTypeAlias
    ) {
      continue;
    }

    context.report({
      node: typeAlias.node.id,
      messageId: `requireSharedTypeFile`,
    });
  }

  const expectedResultTypeName = `${getPascalCaseName(functionName)}Result`;
  const resultType = localTypeAliases.get(expectedResultTypeName);

  if (
    resultType !== undefined &&
    resultType.isExported === false &&
    resultType.isReturnTypeAlias === false &&
    signatureTypeNames.has(expectedResultTypeName) === false
  ) {
    context.report({
      node: resultType.node.id,
      messageId: `requirePublicResultExport`,
    });
  }
};

export const requireHelperTypePlacementRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require public helper type placement by role suffix.`,
    },
    schema: [],
    messages: {
      requirePropsAdjacency: `Place public Props types immediately above their owning public function.`,
      requirePropsColocation: `Place Props types beside their owning function.`,
      requirePublicPropsExport: `Export Props types owned by exported functions.`,
      requirePublicResultExport: `Export Result types owned by exported functions from feature types.ts.`,
      requireSharedTypeFile: `Place public Context, Options, and Result types in feature types.ts.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const isTypesFile = checkIsTypesFile(filename);
    const localTypeAliases = new Map();
    const functionNodes = [];

    return {
      'TSTypeAliasDeclaration'(node) {
        const isExported = node.parent?.type === `ExportNamedDeclaration`;
        const placement = getTypePlacement(node.id.name);

        if (placement === null) {
          return;
        }

        localTypeAliases.set(node.id.name, {
          isReturnTypeAlias: checkIsReturnTypeAlias(node),
          isExported,
          node,
          placement,
        });

        if (placement.suffix === `Props`) {
          const hasOwnerImplementationFile = checkHasOwnerImplementationFile(
            filename,
            placement.ownerName,
          );

          if (isTypesFile && hasOwnerImplementationFile) {
            context.report({
              node: node.id,
              messageId: `requirePropsColocation`,
            });
          }

          return;
        }

        if (
          isExported &&
          isTypesFile === false &&
          sharedTypeSuffixes.has(placement.suffix)
        ) {
          if (placement.suffix === `Result` && checkIsReturnTypeAlias(node)) {
            return;
          }

          context.report({
            node: node.id,
            messageId: `requireSharedTypeFile`,
          });
        }
      },

      ':function'(node) {
        functionNodes.push(node);
      },

      'Program:exit'() {
        for (const node of functionNodes) {
          checkFunctionNode(context, isTypesFile, localTypeAliases, node);
        }
      },
    };
  },
};
