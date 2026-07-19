import { expect, test } from 'bun:test';
import { render, screen } from '@testing-library/react';

import { createContextProvider } from '.';

const FOO_VALUE = `bar`;
const useWithoutProps = () => {
  const result = {
    foo: FOO_VALUE,
  };

  return result;
};

type UseWithPropsProps = {
  readonly foo: string;
};
const useWithProps = (props: UseWithPropsProps) => {
  const { foo } = props;

  const result = {
    foo,
  };

  return result;
};

test(`createContextProvider({ useHook: useWithoutProps }) throws error when used outside Provider`, () => {
  const { useWithPropsContext } = createContextProvider({
    useHook: useWithoutProps,
    name: `WithProps`,
  });

  const TestComponent = () => {
    const { foo } = useWithPropsContext();
    return <div>{foo}</div>;
  };

  const throwingRender = () => {
    render(<TestComponent />);
  };
  expect(throwingRender).toThrow(`useContext must be used within a Provider`);
});

test(`createContextProvider({ useHook: useWithoutProps })`, () => {
  const { WithoutPropsProvider, useWithoutPropsContext } =
    createContextProvider({ useHook: useWithoutProps, name: `WithoutProps` });

  const TestComponent = () => {
    const { foo } = useWithoutPropsContext();

    return <div>{foo}</div>;
  };

  render(
    <WithoutPropsProvider>
      <TestComponent />
    </WithoutPropsProvider>,
  );
  const element = screen.getByText(FOO_VALUE);
  expect(element).toBeInTheDocument();
});

test(`createContextProvider({ useHook: useWithProps })`, () => {
  const { WithPropsProvider, useWithPropsContext } = createContextProvider({
    useHook: useWithProps,
    name: `WithProps`,
  });

  const TestComponent = () => {
    const { foo } = useWithPropsContext();

    return <div>{foo}</div>;
  };

  render(
    <WithPropsProvider foo={FOO_VALUE}>
      <TestComponent />
    </WithPropsProvider>,
  );
  const element = screen.getByText(FOO_VALUE);
  expect(element).toBeInTheDocument();
});
