import { type MantineThemeOverride } from '@mantine/core';

export const THEME_DEFAULT: MantineThemeOverride = {
  colors: {
    brand: [
      `#eef6ff`,
      `#dbeafe`,
      `#bfdbfe`,
      `#93c5fd`,
      `#60a5fa`,
      `#3b82f6`,
      `#2563eb`,
      `#1d4ed8`,
      `#1e40af`,
      `#1e3a8a`,
    ],
  },
  primaryColor: `brand`,
  fontFamily: `Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`,
  defaultRadius: `md`,
  headings: {
    fontWeight: `600`,
  },
};

export const COLOR_SCHEME_DARK = `dark` as const;
export const COLOR_SCHEME_LIGHT = `light` as const;
export const COLOR_SCHEMES = [COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT] as const;
export const COLOR_SCHEME_DEFAULT = COLOR_SCHEME_DARK;
