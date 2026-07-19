import { Button } from '../button';

import { ThemeProvider } from './ThemeProvider';

export const Example = () => {
  return (
    <ThemeProvider>
      <Button>Theme provider</Button>
    </ThemeProvider>
  );
};
