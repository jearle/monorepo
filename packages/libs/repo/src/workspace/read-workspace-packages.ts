import fs from 'node:fs';
import path from 'node:path';

import { WorkspacePackageJsonSchema } from './workspace-package-json-schema';
import { type WorkspacePackage, type WorkspacePackageJson } from './types';

const readPackageJson = (filename: string): WorkspacePackageJson => {
  const text = fs.readFileSync(filename, `utf8`);
  const json: unknown = JSON.parse(text);
  const parseResult = WorkspacePackageJsonSchema.safeParse(json);

  if (parseResult.success === false) {
    throw new Error(`Invalid package.json: ${filename}`);
  }

  const result = parseResult.data;
  return result;
};
export type ReadWorkspacePackagesProps = {
  readonly repoRoot: string;
};

export const readWorkspacePackages = (props: ReadWorkspacePackagesProps) => {
  const { repoRoot } = props;
  const packagesRoot = path.join(repoRoot, `packages`);
  const packageFamilies = fs
    .readdirSync(packagesRoot, {
      withFileTypes: true,
    })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .toSorted();
  const result = packageFamilies.flatMap((family) => {
    const familyPath = path.join(packagesRoot, family);
    const packageDirectories = fs
      .readdirSync(familyPath, {
        withFileTypes: true,
      })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .toSorted();

    return packageDirectories.flatMap((directoryName) => {
      const directory = path.join(familyPath, directoryName);
      const packageJsonFilename = path.join(directory, `package.json`);
      const packageJsonExists = fs.existsSync(packageJsonFilename);

      if (packageJsonExists === false) {
        return [];
      }

      const packageJson = readPackageJson(packageJsonFilename);
      const relativeDirectory = path
        .relative(repoRoot, directory)
        .split(path.sep)
        .join(`/`);
      const packageInfo: WorkspacePackage = {
        directory,
        directoryName,
        family,
        name: packageJson.name,
        packageJson,
        relativeDirectory,
      };

      return [packageInfo];
    });
  });

  return result;
};
