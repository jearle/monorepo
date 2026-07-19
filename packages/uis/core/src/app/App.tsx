import '@mantine/core/styles.css';

import { ButtonExample } from '../button';
import { InputExample } from '../input';
import { PasswordInputExample } from '../password-input';
import { ThemeProvider } from '../theme-provider';

export const App = () => {
  return (
    <ThemeProvider>
      <div data-testid={`ui-core.app.App`}>
        <InputExample />
        <PasswordInputExample />
        <ButtonExample />
      </div>
    </ThemeProvider>
  );
};
