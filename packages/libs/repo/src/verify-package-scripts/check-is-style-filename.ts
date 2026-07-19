import path from 'node:path';

import { STYLE_FILE_EXTENSIONS } from './constants';

export const checkIsStyleFilename = (filename: string) => {
  const extension = path.extname(filename);
  const result = STYLE_FILE_EXTENSIONS.has(extension);

  return result;
};
