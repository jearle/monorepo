import fs from 'node:fs';
import path from 'node:path';

import {
  getPackageSrcPath,
  getRuleFilename,
  getRuleSourceCode,
} from './rule-path-helpers.js';
import { workflowBehaviorVerbNamePattern } from './workflow-behavior-verbs.js';

const serviceContextNamePattern =
  /^(?:[A-Z][A-Za-z0-9]*|__Skeleton)ServiceContext$/u;
const serviceFactoryNamePattern =
  /^create(?<domain>[A-Z][A-Za-z0-9]*|__skeleton)Service$/u;
const workflowImportNamePattern = workflowBehaviorVerbNamePattern;

const checkIsServicePackageSource = (filename) => {
  const packageSrcPath = getPackageSrcPath(filename);
  const result = packageSrcPath?.family === `services`;

  return result;
};

const checkIsEmptyServiceContextAnnotation = (context, node) => {
  const sourceCode = getRuleSourceCode(context);
  const typeText = sourceCode.getText(node.typeAnnotation);
  const result =
    /\bReadonly\s*<\s*Record\s*<\s*string\s*,\s*never\s*>\s*>/u.test(typeText);

  return result;
};

const checkHasNonEmptySiblingServiceFactory = (filename) => {
  const directory = path.posix.dirname(filename);
  const serviceFolderName = path.posix.basename(directory);
  const factoryFilename = path.posix.join(
    directory,
    `create-${serviceFolderName}.ts`,
  );

  if (fs.existsSync(factoryFilename) === false) {
    return false;
  }

  const factoryText = fs.readFileSync(factoryFilename, `utf8`);
  const result =
    /const\s+[A-Za-z0-9_]*Service[A-Za-z0-9_]*\s*(?::[^=]+)?=\s*\{\s*[A-Za-z0-9_$]/u.test(
      factoryText,
    ) ||
    /const\s+service\s*(?::[^=]+)?=\s*\{\s*[A-Za-z0-9_$]/u.test(factoryText);

  return result;
};

const getImportedRuntimeNames = (node) => {
  const names = [];

  for (const specifier of node.specifiers) {
    if (specifier.type !== `ImportSpecifier`) {
      continue;
    }

    if (node.importKind === `type` || specifier.importKind === `type`) {
      continue;
    }

    const localName = specifier.local.name;
    names.push(localName);
  }

  return names;
};

const getFunctionFactoryName = (node) => {
  if (node.type === `FunctionDeclaration`) {
    return node.id?.name ?? null;
  }

  const variableDeclarator = node.parent;

  if (
    variableDeclarator?.type !== `VariableDeclarator` ||
    variableDeclarator.id.type !== `Identifier`
  ) {
    return null;
  }

  return variableDeclarator.id.name;
};

const checkIsServiceFactoryFunction = (node) => {
  const factoryName = getFunctionFactoryName(node);
  const result =
    factoryName !== null && serviceFactoryNamePattern.test(factoryName);

  return result;
};

const checkIsTypedServiceContextParameter = (parameter) => {
  if (
    parameter?.type !== `Identifier` ||
    parameter.typeAnnotation?.type !== `TSTypeAnnotation`
  ) {
    return false;
  }

  const { typeAnnotation } = parameter.typeAnnotation;

  if (
    typeAnnotation.type !== `TSTypeReference` ||
    typeAnnotation.typeName.type !== `Identifier`
  ) {
    return false;
  }

  const result = serviceContextNamePattern.test(typeAnnotation.typeName.name);

  return result;
};

const getCamelCaseServiceDomainName = (domainName) => {
  if (domainName === `__skeleton`) {
    return domainName;
  }

  const leadingAcronym = domainName.match(/^[A-Z]+(?=[A-Z][a-z])/u)?.[0];

  if (leadingAcronym !== undefined) {
    const result = `${leadingAcronym.toLowerCase()}${domainName.slice(
      leadingAcronym.length,
    )}`;

    return result;
  }

  const result = `${domainName.slice(0, 1).toLowerCase()}${domainName.slice(
    1,
  )}`;

  return result;
};

const getExpectedServiceObjectName = (factoryName) => {
  const domainName = factoryName?.match(serviceFactoryNamePattern)?.groups
    ?.domain;

  if (domainName === undefined) {
    return null;
  }

  const camelCaseDomainName = getCamelCaseServiceDomainName(domainName);
  const result = `${camelCaseDomainName}Service`;

  return result;
};

const checkIsServiceObjectName = (name) => {
  const result =
    name === `service` ||
    name === `__skeletonService` ||
    /^[a-z][A-Za-z0-9]*Service$/u.test(name);

  return result;
};

const getObjectPropertyName = (property) => {
  if (property.type !== `Property`) {
    return null;
  }

  if (property.key.type === `Identifier`) {
    return property.key.name;
  }

  if (
    property.key.type === `Literal` &&
    typeof property.key.value === `string`
  ) {
    return property.key.value;
  }

  return null;
};

const collectServiceReturnNameNodes = (
  objectExpression,
  expectedServiceName,
) => {
  if (expectedServiceName === null) {
    return [];
  }

  const serviceReturnNameNodes = [];

  for (const property of objectExpression.properties) {
    const propertyName = getObjectPropertyName(property);

    if (propertyName === null) {
      continue;
    }

    const valueName =
      property.type === `Property` && property.value.type === `Identifier`
        ? property.value.name
        : null;
    const isServiceReturn =
      checkIsServiceObjectName(propertyName) ||
      (valueName !== null && checkIsServiceObjectName(valueName));

    if (isServiceReturn === false) {
      continue;
    }

    if (propertyName === expectedServiceName) {
      continue;
    }

    serviceReturnNameNodes.push({
      actualName: propertyName,
      expectedName: expectedServiceName,
      node: property.key,
    });
  }

  return serviceReturnNameNodes;
};

const collectFactoryDetails = (node, importedWorkflowNames) => {
  const factoryName = getFunctionFactoryName(node);
  const expectedServiceName = getExpectedServiceObjectName(factoryName);
  const details = {
    hasNonEmptyServiceObject: false,
    directWorkflowProperties: [],
    serviceReturnNameNodes: [],
    voidContextNodes: [],
  };
  const [firstParameter] = node.params;
  const contextName =
    firstParameter?.type === `Identifier` ? firstParameter.name : null;

  const visit = (currentNode) => {
    if (currentNode === null || currentNode === undefined) {
      return;
    }

    if (Array.isArray(currentNode)) {
      for (const item of currentNode) {
        visit(item);
      }

      return;
    }

    if (typeof currentNode !== `object`) {
      return;
    }

    if (
      currentNode.type === `UnaryExpression` &&
      currentNode.operator === `void` &&
      currentNode.argument.type === `Identifier` &&
      currentNode.argument.name === contextName
    ) {
      details.voidContextNodes.push(currentNode);
    }

    if (
      currentNode.type === `VariableDeclarator` &&
      currentNode.id.type === `Identifier` &&
      checkIsServiceObjectName(currentNode.id.name) &&
      currentNode.init?.type === `ObjectExpression` &&
      currentNode.init.properties.length > 0
    ) {
      details.hasNonEmptyServiceObject = true;

      for (const property of currentNode.init.properties) {
        if (
          property.type !== `Property` ||
          property.value.type !== `Identifier`
        ) {
          continue;
        }

        if (importedWorkflowNames.has(property.value.name) === false) {
          continue;
        }

        const propertyName = getObjectPropertyName(property);

        details.directWorkflowProperties.push({
          node: property.value,
          propertyName,
          workflowName: property.value.name,
        });
      }
    }

    if (
      currentNode.type === `VariableDeclarator` &&
      currentNode.id.type === `Identifier` &&
      currentNode.id.name === `result` &&
      currentNode.init?.type === `ObjectExpression`
    ) {
      details.serviceReturnNameNodes.push(
        ...collectServiceReturnNameNodes(currentNode.init, expectedServiceName),
      );
    }

    if (
      currentNode.type === `ReturnStatement` &&
      currentNode.argument?.type === `ObjectExpression`
    ) {
      details.serviceReturnNameNodes.push(
        ...collectServiceReturnNameNodes(
          currentNode.argument,
          expectedServiceName,
        ),
      );
    }

    for (const [key, value] of Object.entries(currentNode)) {
      if (
        key === `parent` ||
        key === `loc` ||
        key === `range` ||
        key === `type`
      ) {
        continue;
      }

      visit(value);
    }
  };

  visit(node.body);

  return details;
};

export const requireServiceFactoryContextRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require non-empty service factories to receive and pass real service context.`,
    },
    schema: [],
    messages: {
      noEmptyServiceFactoryCall: `Pass a typed service context to non-empty service factories instead of an empty object.`,
      requireContextParameter: `Receive a typed service context in non-empty service factories.`,
      requireContextUse: `Pass service factory context into workflow method wrappers instead of discarding it.`,
      requireNonEmptyServiceContext: `Use a real service context type for non-empty service factories.`,
      requireServiceFactoryReturnName: `Return service factory result key {{ expectedName }} instead of {{ actualName }}.`,
      requireServiceMethodWrapper: `Wrap {{ workflowName }} in a service method that passes service context.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const importedWorkflowNames = new Set();
    const serviceFactoryNodes = [];

    return {
      'ImportDeclaration'(node) {
        for (const importedName of getImportedRuntimeNames(node)) {
          if (workflowImportNamePattern.test(importedName)) {
            importedWorkflowNames.add(importedName);
          }
        }
      },

      'TSTypeAliasDeclaration'(node) {
        if (checkIsServicePackageSource(filename) === false) {
          return;
        }

        if (serviceContextNamePattern.test(node.id.name) === false) {
          return;
        }

        if (checkIsEmptyServiceContextAnnotation(context, node) === false) {
          return;
        }

        if (checkHasNonEmptySiblingServiceFactory(filename) === false) {
          return;
        }

        context.report({
          node: node.id,
          messageId: `requireNonEmptyServiceContext`,
        });
      },

      ':function'(node) {
        if (checkIsServicePackageSource(filename) === false) {
          return;
        }

        if (checkIsServiceFactoryFunction(node)) {
          serviceFactoryNodes.push(node);
        }
      },

      'CallExpression'(node) {
        if (
          node.callee.type !== `Identifier` ||
          serviceFactoryNamePattern.test(node.callee.name) === false
        ) {
          return;
        }

        const [firstArgument] = node.arguments;

        if (
          firstArgument?.type !== `ObjectExpression` ||
          firstArgument.properties.length > 0
        ) {
          return;
        }

        context.report({
          node: firstArgument,
          messageId: `noEmptyServiceFactoryCall`,
        });
      },

      'Program:exit'() {
        for (const node of serviceFactoryNodes) {
          const details = collectFactoryDetails(node, importedWorkflowNames);

          if (details.hasNonEmptyServiceObject === false) {
            continue;
          }

          if (checkIsTypedServiceContextParameter(node.params[0]) === false) {
            context.report({
              node,
              messageId: `requireContextParameter`,
            });
          }

          for (const serviceReturnNameNode of details.serviceReturnNameNodes) {
            context.report({
              node: serviceReturnNameNode.node,
              messageId: `requireServiceFactoryReturnName`,
              data: {
                actualName: serviceReturnNameNode.actualName,
                expectedName: serviceReturnNameNode.expectedName,
              },
            });
          }

          for (const voidContextNode of details.voidContextNodes) {
            context.report({
              node: voidContextNode,
              messageId: `requireContextUse`,
            });
          }

          for (const directWorkflowProperty of details.directWorkflowProperties) {
            context.report({
              node: directWorkflowProperty.node,
              messageId: `requireServiceMethodWrapper`,
              data: {
                workflowName: directWorkflowProperty.workflowName,
              },
            });
          }
        }
      },
    };
  },
};
