import { PasswordInput } from './PasswordInput';

export const PasswordInputExample = () => {
  return (
    <div data-testid={`ui-core.input.PasswordInputExample`}>
      <h3>PasswordInputExample</h3>
      <PasswordInput placeholder={`enter password...`} />
    </div>
  );
};
