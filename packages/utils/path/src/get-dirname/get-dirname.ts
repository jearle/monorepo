import path from 'node:path';
import type { URL } from 'node:url';

import { getFilename } from '../get-filename';

export const getDirname = (url: string | URL) => {
  const filename = getFilename(url);
  const dirname = path.dirname(filename);

  return dirname;
};
