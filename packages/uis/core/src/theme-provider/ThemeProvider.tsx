import '@mantine/core/styles.css';

import { type ComponentProps } from 'react';
import { MantineProvider } from '@mantine/core';

import { THEME_DEFAULT } from './constants';
import { useLocalStorageColorScheme } from './use-local-storage-color-scheme';

export type ThemeProviderProps = ComponentProps<typeof MantineProvider>;
export const ThemeProvider = (props: ThemeProviderProps) => {
  const { localStorageColorScheme } = useLocalStorageColorScheme();
  const { forceColorScheme = localStorageColorScheme } = props;

  return (
    <MantineProvider
      theme={THEME_DEFAULT}
      forceColorScheme={forceColorScheme}
      {...props}
    />
  );
};
