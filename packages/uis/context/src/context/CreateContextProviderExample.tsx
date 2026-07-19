import { createContextProvider } from './create-context-provider';

type UseExampleProps = {
  readonly text: string;
};
const useExample = (props: UseExampleProps) => {
  const { text } = props;
  const result = {
    text,
  };

  return result;
};

const { ExampleProvider, useExampleContext } = createContextProvider({
  useHook: useExample,
  name: `Example`,
});

const Text = () => {
  const { text } = useExampleContext();

  return <div data-testid={`context.context.Text`}>{text}</div>;
};

export const CreateContextProviderExample = () => {
  return (
    <ExampleProvider text={`Example`}>
      <Text />
    </ExampleProvider>
  );
};
