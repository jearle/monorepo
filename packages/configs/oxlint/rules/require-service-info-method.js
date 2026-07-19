import { getPackageSrcPath, getRuleFilename } from './rule-path-helpers.js';

const serviceFactoryNamePattern =
  /^create(?:[A-Z][A-Za-z0-9]*|__skeleton)Service$/u;

const checkIsServicePackageSource = (filename) => {
  const packageSrcPath = getPackageSrcPath(filename);
  const result = packageSrcPath?.family === `services`;

  return result;
};

const checkIsServiceObjectName = (name) => {
  const result =
    name === `service` ||
    name === `__skeletonService` ||
    /^[a-z][A-Za-z0-9]*Service$/u.test(name);

  return result;
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

const findServiceObjectDeclarator = (node) => {
  let serviceObjectDeclarator = null;

  const visit = (currentNode) => {
    if (serviceObjectDeclarator !== null) {
      return;
    }

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
      currentNode.type === `VariableDeclarator` &&
      currentNode.id.type === `Identifier` &&
      checkIsServiceObjectName(currentNode.id.name) &&
      currentNode.init?.type === `ObjectExpression`
    ) {
      serviceObjectDeclarator = currentNode;

      return;
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

  return serviceObjectDeclarator;
};

export const requireServiceInfoMethodRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require service factories to expose an info method on the service object.`,
    },
    schema: [],
    messages: {
      requireServiceInfoMethod: `Expose an info method on the {{ serviceName }} service object.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const serviceFactoryNodes = [];

    return {
      ':function'(node) {
        if (checkIsServicePackageSource(filename) === false) {
          return;
        }

        if (checkIsServiceFactoryFunction(node)) {
          serviceFactoryNodes.push(node);
        }
      },

      'Program:exit'() {
        for (const node of serviceFactoryNodes) {
          const serviceObjectDeclarator = findServiceObjectDeclarator(node);

          if (serviceObjectDeclarator === null) {
            continue;
          }

          const { properties } = serviceObjectDeclarator.init;

          if (properties.length === 0) {
            continue;
          }

          const hasInfoMethod = properties.some(
            (property) => getObjectPropertyName(property) === `info`,
          );

          if (hasInfoMethod) {
            continue;
          }

          context.report({
            node: serviceObjectDeclarator.id,
            messageId: `requireServiceInfoMethod`,
            data: {
              serviceName: serviceObjectDeclarator.id.name,
            },
          });
        }
      },
    };
  },
};
