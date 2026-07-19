const zodNamespaceSources = new Set([
  '@hono/zod-openapi',
  'zod',
  'zod/v4',
  'zod/v4/core',
]);

const getImportSourceValue = (node) => {
  if (node.source.type !== `Literal` || typeof node.source.value !== `string`) {
    return null;
  }

  return node.source.value;
};

const getImportSpecifierImportedName = (specifier) => {
  if (specifier.type !== `ImportSpecifier`) {
    return null;
  }

  const imported = specifier.imported;

  if (imported.type === `Identifier`) {
    return imported.name;
  }

  if (imported.type === `Literal` && typeof imported.value === `string`) {
    return imported.value;
  }

  return null;
};

const getReferenceNode = (reference) =>
  reference.identifier ?? reference.node ?? null;

const checkDoesReferenceMatchIdentifier = (reference, identifier) => {
  const referenceNode = getReferenceNode(reference);

  if (referenceNode === null || referenceNode.range === undefined) {
    return false;
  }

  return (
    referenceNode.range[0] === identifier.range[0] &&
    referenceNode.range[1] === identifier.range[1]
  );
};

const getImportSpecifierLocalName = (specifier) => {
  if (
    specifier.type === `ImportDefaultSpecifier` ||
    specifier.type === `ImportNamespaceSpecifier` ||
    specifier.type === `ImportSpecifier`
  ) {
    return specifier.local.name;
  }

  return null;
};

const checkIsTrackedZodSpecifier = (specifier) => {
  if (
    specifier.type === `ImportNamespaceSpecifier` ||
    specifier.type === `ImportDefaultSpecifier`
  ) {
    return true;
  }

  return (
    specifier.type === `ImportSpecifier` &&
    getImportSpecifierImportedName(specifier) === `z`
  );
};

export const createZodImportTracker = (sourceCode) => {
  const zodBindings = new Map();

  const recordImportDeclaration = (node) => {
    const source = getImportSourceValue(node);

    if (
      node.importKind === `type` ||
      source === null ||
      zodNamespaceSources.has(source) === false
    ) {
      return;
    }

    for (const specifier of node.specifiers) {
      if (
        specifier.importKind === `type` ||
        checkIsTrackedZodSpecifier(specifier) === false
      ) {
        continue;
      }

      const localName = getImportSpecifierLocalName(specifier);

      if (localName === null) {
        continue;
      }

      const [variable = null] = sourceCode.getDeclaredVariables(specifier);
      zodBindings.set(localName, { variable });
    }
  };

  const checkIdentifierReferencesBinding = (binding, identifier) => {
    const references = binding.variable?.references ?? [];

    if (references.length === 0) {
      return false;
    }

    return references.some((reference) =>
      checkDoesReferenceMatchIdentifier(reference, identifier),
    );
  };

  return {
    checkIdentifierReferencesBinding,
    getBinding: (name) => zodBindings.get(name),
    recordImportDeclaration,
  };
};
