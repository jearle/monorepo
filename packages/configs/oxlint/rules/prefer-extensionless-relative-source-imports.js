import path from 'node:path';

const sourceImportExtensions = new Set([
  `.cjs`,
  `.cts`,
  `.js`,
  `.jsx`,
  `.mjs`,
  `.mts`,
  `.ts`,
  `.tsx`,
]);

const checkIsRelativeSourceImport = (source) => {
  if (!source.startsWith(`.`)) {
    return false;
  }

  const extension = path.posix.extname(source);
  const result = sourceImportExtensions.has(extension);

  return result;
};

const stripSourceImportExtension = (source) => {
  const extension = path.posix.extname(source);
  const result = source.slice(0, -extension.length);

  return result;
};

const getImportSourceLiteral = (node) => {
  if (
    (node.type === `ImportDeclaration` ||
      node.type === `ExportNamedDeclaration` ||
      node.type === `ExportAllDeclaration`) &&
    node.source?.type === `Literal` &&
    typeof node.source.value === `string`
  ) {
    return node.source;
  }

  if (
    node.type === `ImportExpression` &&
    node.source.type === `Literal` &&
    typeof node.source.value === `string`
  ) {
    return node.source;
  }

  if (node.type !== `TSImportType`) {
    return null;
  }

  const sourceNode = node.source;

  if (sourceNode.type === `Literal` && typeof sourceNode.value === `string`) {
    return sourceNode;
  }

  if (
    sourceNode.type === `TSLiteralType` &&
    sourceNode.literal.type === `Literal` &&
    typeof sourceNode.literal.value === `string`
  ) {
    return sourceNode.literal;
  }

  return null;
};

const createLiteralReplacement = (sourceCode, node, source) => {
  const raw = sourceCode.getText(node);
  const quote = raw.at(0);

  if (quote !== `'` && quote !== `"`) {
    return null;
  }

  const extensionlessSource = stripSourceImportExtension(source);
  const result = `${quote}${extensionlessSource}${quote}`;

  return result;
};

const createImportVisitor = (context) => {
  const sourceCode = context.sourceCode;

  return (node) => {
    const literal = getImportSourceLiteral(node);
    const source = literal?.value;

    if (typeof source !== `string`) {
      return;
    }

    const isRelativeSourceImport = checkIsRelativeSourceImport(source);

    if (isRelativeSourceImport === false) {
      return;
    }

    const replacement = createLiteralReplacement(sourceCode, literal, source);

    context.report({
      node: literal,
      messageId: `preferExtensionlessRelativeSourceImport`,
      fix(fixer) {
        if (replacement === null) {
          return null;
        }

        return fixer.replaceText(literal, replacement);
      },
    });
  };
};

export const preferExtensionlessRelativeSourceImportsRule = {
  meta: {
    type: `layout`,
    docs: {
      description: `Prefer extensionless relative imports between source files.`,
    },
    fixable: `code`,
    schema: [],
    messages: {
      preferExtensionlessRelativeSourceImport: `Use extensionless relative source imports.`,
    },
  },
  create(context) {
    const visitImport = createImportVisitor(context);

    return {
      ExportAllDeclaration: visitImport,
      ExportNamedDeclaration: visitImport,
      ImportDeclaration: visitImport,
      ImportExpression: visitImport,
      TSImportType: visitImport,
    };
  },
};
