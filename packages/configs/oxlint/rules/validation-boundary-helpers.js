import {
  checkIsDeclarationFilename,
  checkIsTestFilename,
  getPackageSrcPath,
} from './rule-path-helpers.js';

const internalZodParseAllowedPackageFamilies = new Set([`schemas`]);

export const checkIsBoundaryValidationFilename = (filename) => {
  const isTestFilename = checkIsTestFilename(filename);
  const isDeclarationFilename = checkIsDeclarationFilename(filename);

  if (isTestFilename || isDeclarationFilename) {
    return false;
  }

  const packageSrcPath = getPackageSrcPath(filename);

  if (packageSrcPath === null) {
    return false;
  }

  const isInternalZodParseAllowedPackage =
    internalZodParseAllowedPackageFamilies.has(packageSrcPath.family);

  return !isInternalZodParseAllowedPackage;
};

export const getStaticPropertyName = (node) => {
  if (node.type === `MemberExpression`) {
    if (node.property.type === `Identifier` && node.computed === false) {
      return node.property.name;
    }

    if (
      node.property.type === `Literal` &&
      typeof node.property.value === `string`
    ) {
      return node.property.value;
    }

    return null;
  }

  if (node.type === `Identifier`) {
    return node.name;
  }

  if (node.type === `Literal` && typeof node.value === `string`) {
    return node.value;
  }

  return null;
};

export const getRootIdentifierName = (node) => {
  if (node.type === `Identifier`) {
    return node.name;
  }

  if (node.type === `ChainExpression`) {
    return getRootIdentifierName(node.expression);
  }

  if (node.type === `MemberExpression`) {
    return getRootIdentifierName(node.object);
  }

  return null;
};

export const checkIsZodSchemaMethodCall = (node, methodName) => {
  if (node.type !== `CallExpression`) {
    return false;
  }

  const callee = node.callee;

  if (callee.type !== `MemberExpression`) {
    return false;
  }

  const propertyName = getStaticPropertyName(callee);
  const isExpectedMethodName = propertyName === methodName;

  if (!isExpectedMethodName) {
    return false;
  }

  const rootIdentifierName = getRootIdentifierName(callee.object);
  const isZodSchemaMethodCall =
    rootIdentifierName?.endsWith(`Schema`) === true ||
    rootIdentifierName === `schema`;

  return isZodSchemaMethodCall;
};
