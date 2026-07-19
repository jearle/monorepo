import { type Template, Tag, toValueSync } from 'liquidjs';

import { LIQUID_IMPORT_TAG_NAMES, LIQUID_TAG_NAME_LAYOUT } from './constants';

export type SourceTemplateImport = {
  readonly dynamic: boolean;
  readonly kind: `layouts` | `partials`;
  readonly request: string | null;
  readonly template: Tag;
};

const checkIsImportTag = (node: Template): node is Tag => {
  const result =
    node instanceof Tag &&
    LIQUID_IMPORT_TAG_NAMES.some((name) => name === node.name);

  return result;
};

const collectNestedTemplates = (node: Template) => {
  if (node.children === undefined) {
    const result: readonly Template[] = [];

    return result;
  }

  const children = toValueSync(node.children(false, true));
  const result = Array.isArray(children) ? children : [];

  return result;
};

export const findSourceTemplateImports = (
  templates: readonly Template[],
): readonly SourceTemplateImport[] => {
  let imports: readonly SourceTemplateImport[] = [];

  for (const node of templates) {
    if (checkIsImportTag(node)) {
      const partial = (node as Template).partialScope?.();
      const fileValue: unknown = Reflect.get(node, `file`);

      if (node.name === LIQUID_TAG_NAME_LAYOUT && fileValue === undefined) {
        continue;
      }

      const request = partial?.name ?? null;

      imports = [
        ...imports,
        {
          dynamic: partial === undefined,
          kind: node.name === LIQUID_TAG_NAME_LAYOUT ? `layouts` : `partials`,
          request,
          template: node,
        },
      ];
    }

    const nestedImports = findSourceTemplateImports(
      collectNestedTemplates(node),
    );
    imports = [...imports, ...nestedImports];
  }

  return imports;
};
