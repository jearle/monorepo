import { type Dirent } from 'node:fs';

import { type Result } from '@jearle/util-result';

export type ReadDirectoryEntriesResult = Result<readonly Dirent[]>;
