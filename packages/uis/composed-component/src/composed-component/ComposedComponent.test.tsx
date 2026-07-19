import { expect, test } from 'bun:test';
import { type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import { ComposedComponent } from '.';

const DATA_TEST_ID_PREFIX = `composed-component.composed-component.ComposedComponent.test.Component`;
const createTestID = (testIDSuffix: string) => {
  const testID = `${DATA_TEST_ID_PREFIX}${testIDSuffix}`;

  return testID;
};
type ComponentToComposeProps = {
  readonly children: ReactNode;
  readonly testID: string;
};
const ComponentToCompose = (props: ComponentToComposeProps) => {
  const { children, testID } = props;

  return <div data-testid={testID}>{children}</div>;
};
test(`<ComposedComponent>`, () => {
  const componentEntries = [`A`, `B`, `C`].map((testIDSuffix) => {
    const testID = createTestID(testIDSuffix);

    const componentEntry = { Component: ComponentToCompose, props: { testID } };

    return componentEntry;
  });

  const children = `test`;
  render(
    <ComposedComponent layers={componentEntries}>{children}</ComposedComponent>,
  );
  const textElement = screen.getByText(children);

  const testIDElements = componentEntries.map((componentEntry) => {
    const { testID } = componentEntry.props;

    const testIDElement = screen.getByTestId(testID);

    return testIDElement;
  });

  testIDElements.forEach((testIDElement, i) => {
    if (i === testIDElements.length - 1) {
      expect(testIDElement).toContainElement(textElement);
      return;
    }
    const nextTestIDElement = testIDElements[i + 1];

    if (nextTestIDElement === undefined) {
      expect(nextTestIDElement).toBeDefined();
      return;
    }

    expect(testIDElement).toContainElement(nextTestIDElement);
  });
});
