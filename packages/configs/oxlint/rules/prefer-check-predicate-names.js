import {
  predicateFunctionNamePattern,
  predicateNamePattern,
  checkIsTypedCallableBinding,
  createBindingIdentifiers,
  getPropertyName,
} from './prefer-check-predicate-names-helpers.js';
import {
  checkHasCallableInitializer,
  checkIsFunctionNode,
  getExplicitInitializerType,
} from './prefer-check-predicate-callable-types.js';

const reportPredicateName = (context, node, name) => {
  if (!predicateNamePattern.test(name)) {
    return;
  }

  context.report({
    node,
    messageId: `preferCheckPredicateName`,
  });
};

export const preferCheckPredicateNamesRule = {
  meta: {
    type: `suggestion`,
    docs: {
      description: `Require predicate functions and boolean values to use distinct conventional names.`,
    },
    messages: {
      preferBooleanPredicateValueName: `Use is*, has*, can*, or should* for boolean values. Reserve check* names for bindings proven callable by a function initializer or explicit function type.`,
      preferCheckPredicateName: `Use checkIs*, checkHas*, checkCan*, or checkShould* for predicate function names.`,
    },
    schema: [
      {
        type: `object`,
        properties: {
          requireBooleanValueNames: {
            type: `boolean`,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const requireBooleanValueNames =
      context.options[0]?.requireBooleanValueNames === true;
    const callableTypeAliases = new Map();
    const declarators = [];

    return {
      'FunctionDeclaration'(node) {
        if (node.id === null) {
          return;
        }

        reportPredicateName(context, node.id, node.id.name);
      },
      'Program:exit'() {
        for (const declarator of declarators) {
          const initializerType = getExplicitInitializerType(declarator.init);
          const hasCallableInitializer =
            declarator.id.type === `Identifier` &&
            checkHasCallableInitializer(declarator.init, callableTypeAliases);

          for (const identifier of createBindingIdentifiers(declarator.id)) {
            const isCallable =
              hasCallableInitializer ||
              checkIsTypedCallableBinding(
                declarator.id,
                identifier,
                initializerType,
                callableTypeAliases,
              );

            if (isCallable) {
              reportPredicateName(context, identifier, identifier.name);
            }

            if (
              requireBooleanValueNames === false ||
              !predicateFunctionNamePattern.test(identifier.name) ||
              isCallable
            ) {
              continue;
            }

            context.report({
              node: identifier,
              messageId: `preferBooleanPredicateValueName`,
            });
          }
        }
      },
      'Property'(node) {
        if (!checkIsFunctionNode(node.value)) {
          return;
        }

        const propertyName = getPropertyName(node.key);

        if (propertyName === null) {
          return;
        }

        reportPredicateName(context, node.key, propertyName);
      },
      'TSTypeAliasDeclaration'(node) {
        callableTypeAliases.set(node.id.name, node.typeAnnotation);
      },
      'VariableDeclarator'(node) {
        declarators.push(node);
      },
    };
  },
};
