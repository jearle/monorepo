import path from 'node:path';

export type CreateSourceTemplateImportLabelProps = {
  readonly currentLabel: string;
  readonly extname: string;
  readonly importName: string;
};

export const createSourceTemplateImportLabel = (
  props: CreateSourceTemplateImportLabelProps,
) => {
  const { currentLabel, extname, importName } = props;

  if (path.isAbsolute(importName)) {
    return `<absolute-import>`;
  }

  const pathWithExtension =
    path.posix.extname(importName) === ``
      ? `${importName}${extname}`
      : importName;
  const isRelative =
    importName.startsWith(`./`) || importName.startsWith(`../`);
  const label = isRelative
    ? path.posix.join(path.posix.dirname(currentLabel), pathWithExtension)
    : pathWithExtension;

  const result = path.posix.normalize(label);

  return result;
};
