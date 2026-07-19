import { useLocalStorage } from '@jearle/ui-hooks';

import { type ColorScheme } from './types';
import { COLOR_SCHEME_DEFAULT } from './constants';

export const LOCAL_STORAGE_KEY = `ui-core.use-local-storage-color-scheme.colorScheme`;
export const useLocalStorageColorScheme = () => {
  const [localStorageColorScheme, setLocalStorageColorScheme] =
    useLocalStorage<ColorScheme>({
      key: LOCAL_STORAGE_KEY,
      defaultValue: COLOR_SCHEME_DEFAULT,
    });

  const result = { localStorageColorScheme, setLocalStorageColorScheme };

  return result;
};
