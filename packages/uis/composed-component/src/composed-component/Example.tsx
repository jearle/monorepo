import { type PropsWithChildren } from 'react';

import { ComposedComponent } from './ComposedComponent';
type BorderLayerPropsPropsWithChildren = { readonly label: string };

type BorderLayerProps = PropsWithChildren<BorderLayerPropsPropsWithChildren>;

const BorderLayer = (props: BorderLayerProps) => {
  const { children, label } = props;

  return (
    <section aria-label={label} style={{ border: `1px solid currentColor` }}>
      {children}
    </section>
  );
};

export const Example = () => {
  const layers = [
    {
      Component: BorderLayer,
      props: { label: `Composed content` },
    },
  ];

  return <ComposedComponent layers={layers}>Layered content</ComposedComponent>;
};
