import { access } from 'node:fs/promises';

export type GetPathExistsProps = {
  readonly path: string;
};

export const getPathExists = async (props: GetPathExistsProps) => {
  const { path } = props;

  try {
    await access(path);

    const result = true;
    return result;
  } catch {
    const result = false;
    return result;
  }
};
