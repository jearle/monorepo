import { existsSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';

import {
  TEMPLATE_SOURCE_ERROR_CODE,
  TEMPLATE_SOURCE_PATH_ERROR,
} from '../errors';
import { createSourceTemplateFailure } from './errors';

export const canonicalizeSourcePath = (sourcePath: string) => {
  if (
    path.isAbsolute(sourcePath) === false ||
    existsSync(sourcePath) === false ||
    statSync(sourcePath).isFile() === false
  ) {
    throw createSourceTemplateFailure(
      TEMPLATE_SOURCE_PATH_ERROR,
      TEMPLATE_SOURCE_ERROR_CODE,
    );
  }

  const result = realpathSync(sourcePath);

  return result;
};
