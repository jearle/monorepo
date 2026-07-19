import { Input } from './Input';

export const InputExample = () => {
  return (
    <div data-testid={`ui-core.input.InputExample`}>
      <h3>InputExample</h3>
      <Input placeholder={`enter text...`} />
    </div>
  );
};
