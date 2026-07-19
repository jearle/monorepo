import {
  getPackageSrcPath,
  getRuleFilename,
  getSourceFileStem,
} from './rule-path-helpers.js';

const errorHelperTypeNamePattern =
  /^(?:Create|Get|Format|Map)[A-Z]?[A-Za-z0-9]*(?:Error|ErrorMessage|ErrorResult|ResultError)[A-Za-z0-9]*Props$/u;
const errorHelperFunctionNamePattern =
  /^(?:create|get|format|map)[A-Z]?[A-Za-z0-9]*(?:Error|ErrorMessage|ErrorResult|ResultError)[A-Za-z0-9]*$/u;
const errorHandlerAdapterNamePattern = /^(?:getOnError|onError)$/u;
const errorMessageMapNamePattern = /^[A-Z0-9_]*ERROR_MESSAGE_BY_CODE$/u;

const checkIsErrorModule = (filename) =>
  getSourceFileStem(filename) === `errors`;

const checkIsErrorUtilityPackage = (filename) => {
  const packageSrcPath = getPackageSrcPath(filename);
  const result = packageSrcPath?.packageName === `error`;

  return result;
};

const checkShouldSkipFile = (filename) => {
  const result =
    checkIsErrorModule(filename) || checkIsErrorUtilityPackage(filename);

  return result;
};

const checkIsExported = (node) =>
  node.parent?.type === `ExportNamedDeclaration`;

const checkIsVariableDeclaratorExported = (node) =>
  node.parent?.parent?.type === `ExportNamedDeclaration`;

const getRuntimeName = (node) => {
  if (node.type === `FunctionDeclaration`) {
    return node.id?.name ?? null;
  }

  if (node.type !== `VariableDeclarator` || node.id.type !== `Identifier`) {
    return null;
  }

  return node.id.name;
};

export const requireErrorMessageHelpersInErrorModulesRule = {
  meta: {
    type: `problem`,
    docs: {
      description: `Require error-message helpers to live in error modules.`,
    },
    schema: [
      {
        type: `object`,
        properties: {
          requirePrivateErrorHelpers: {
            type: `boolean`,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireErrorMessageModule: `Place error helpers in the nearest errors.ts module.`,
    },
  },
  create(context) {
    const filename = getRuleFilename(context);
    const requirePrivateErrorHelpers =
      context.options[0]?.requirePrivateErrorHelpers === true;

    if (checkShouldSkipFile(filename)) {
      return {};
    }

    return {
      'TSTypeAliasDeclaration'(node) {
        if (errorHelperTypeNamePattern.test(node.id.name) === false) {
          return;
        }

        if (!requirePrivateErrorHelpers && !checkIsExported(node)) {
          return;
        }

        context.report({
          node: node.id,
          messageId: `requireErrorMessageModule`,
        });
      },

      'FunctionDeclaration, VariableDeclarator'(node) {
        const runtimeName = getRuntimeName(node);

        if (runtimeName === null) {
          return;
        }

        if (
          !requirePrivateErrorHelpers &&
          node.type === `FunctionDeclaration` &&
          !checkIsExported(node)
        ) {
          return;
        }

        if (
          !requirePrivateErrorHelpers &&
          node.type === `VariableDeclarator` &&
          !checkIsVariableDeclaratorExported(node)
        ) {
          return;
        }

        if (
          errorHandlerAdapterNamePattern.test(runtimeName) ||
          (errorHelperFunctionNamePattern.test(runtimeName) === false &&
            errorMessageMapNamePattern.test(runtimeName) === false)
        ) {
          return;
        }

        const reportNode = node.id ?? node;

        context.report({
          node: reportNode,
          messageId: `requireErrorMessageModule`,
        });
      },
    };
  },
};
