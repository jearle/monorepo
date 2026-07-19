import { type URL, fileURLToPath } from 'node:url';

export const getFilename = (url: string | URL) => {
  const filename = fileURLToPath(url);

  return filename;
};
