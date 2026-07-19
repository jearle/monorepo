import {
  checkIsDirectPropsTypeMember,
  checkIsNamedFunctionNode,
  getExpectedParameterName,
  getParameterIdentifier,
  getParameterRole,
  getParameterRoleOrder,
  getParameterTypeRole,
  getPropertyName,
  getPropertyTypeReferenceName,
} from './require-function-parameter-conventions-helpers.js';

export const requireFunctionParameterConventionsRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require conventional ctx, props, and options parameter names, ordering, and operation shape.`,
    },
    schema: [
      {
        type: `object`,
        properties: {
          requireNamedPropsTypeReference: {
            type: `boolean`,
          },
          requireContextOperationShape: {
            type: `boolean`,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireParameterName: `Use {{ expectedName }} for {{ role }} parameters.`,
      requireParameterOrder: `Order function parameters as ctx, props, then options.`,
      requireNoPlaceholderParameter: `Zero-input functions must not use a placeholder parameter.`,
      requirePropsTypeReference: `Use a named Props-suffixed type reference for props parameters.`,
      requireNoCtxPropsProperty: `Do not put ctx on Props types. Pass ctx as the first function parameter.`,
      requireContextFirstParameter: `Pass a shared dependency context as the first function parameter.`,
      requireDirectContextParameter: `Pass a shared dependency context through a direct ctx parameter.`,
      requireContextOperationParameter: `After ctx, pass required operation inputs through props and optional modifiers through options.`,
    },
  },
  create(context) {
    const requireNamedPropsTypeReference =
      context.options[0]?.requireNamedPropsTypeReference === true;
    const requireContextOperationShape =
      context.options[0]?.requireContextOperationShape === true;

    return {
      ':function'(node) {
        if (!checkIsNamedFunctionNode(node)) {
          return;
        }

        if (node.params.length === 1) {
          const identifier = getParameterIdentifier(node.params[0]);

          if (identifier?.name === `_` || identifier?.name === `_props`) {
            context.report({
              node: identifier,
              messageId: `requireNoPlaceholderParameter`,
            });
          }
        }

        if (requireContextOperationShape) {
          for (const parameter of node.params) {
            if (
              getParameterTypeRole(parameter) === `Context` &&
              getParameterIdentifier(parameter) === null
            ) {
              context.report({
                node: parameter,
                messageId: `requireDirectContextParameter`,
              });
            }
          }

          const contextIndex = node.params.findIndex(
            (parameter) => getParameterRole(parameter) === `Context`,
          );

          if (contextIndex > 0) {
            const contextParameter = node.params[contextIndex];

            context.report({
              node:
                getParameterIdentifier(contextParameter) ?? contextParameter,
              messageId: `requireContextFirstParameter`,
            });
          }

          if (contextIndex !== -1) {
            for (const parameter of node.params.slice(contextIndex + 1)) {
              const role = getParameterRole(parameter);
              const identifier = getParameterIdentifier(parameter);

              if (
                identifier !== null &&
                (role === `Props` || role === `Options`)
              ) {
                continue;
              }

              context.report({
                node: identifier ?? parameter,
                messageId: `requireContextOperationParameter`,
              });
            }
          }
        }

        let previousRoleOrder = -1;

        for (const parameter of node.params) {
          const identifier = getParameterIdentifier(parameter);
          const role = getParameterRole(parameter);

          if (requireNamedPropsTypeReference && identifier?.name === `props`) {
            const typeRole = getParameterTypeRole(parameter);

            if (typeRole !== `Props`) {
              context.report({
                node: identifier,
                messageId: `requirePropsTypeReference`,
              });
            }
          }

          if (identifier === null || role === null) {
            continue;
          }

          const expectedName = getExpectedParameterName(role);

          if (expectedName !== undefined && identifier.name !== expectedName) {
            context.report({
              node: identifier,
              messageId: `requireParameterName`,
              data: {
                expectedName,
                role,
              },
            });
          }

          const currentRoleOrder = getParameterRoleOrder(role);

          if (currentRoleOrder === undefined) {
            continue;
          }

          if (currentRoleOrder < previousRoleOrder) {
            context.report({
              node: identifier,
              messageId: `requireParameterOrder`,
            });
          }

          previousRoleOrder = Math.max(previousRoleOrder, currentRoleOrder);
        }
      },
      'TSPropertySignature'(node) {
        const propertyName = getPropertyName(node);

        if (propertyName !== `ctx`) {
          return;
        }

        if (checkIsDirectPropsTypeMember(node) === false) {
          return;
        }

        const typeName = getPropertyTypeReferenceName(node);

        if (typeName?.endsWith(`Context`) !== true) {
          return;
        }

        context.report({
          node,
          messageId: `requireNoCtxPropsProperty`,
        });
      },
    };
  },
};
