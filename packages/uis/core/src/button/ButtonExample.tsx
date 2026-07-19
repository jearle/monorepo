import { Button } from './Button';

export const ButtonExample = () => {
  return (
    <div data-testid={`ui-core.button.ButtonExample`}>
      <h3>ButtonExample</h3>
      <Button>Default</Button>
      <Button variant={`outline`}>variant outline</Button>
      <Button variant={`light`}>variant light</Button>
    </div>
  );
};
