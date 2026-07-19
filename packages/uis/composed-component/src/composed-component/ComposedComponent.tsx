import {
  type ComponentType,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

const EMPTY_PROPS = {};

export type Layer<P extends PropsWithChildren = PropsWithChildren> = {
  readonly Component: ComponentType<P>;
  readonly props: Omit<P, `children`>;
};
export type ComposedComponentProps<P extends PropsWithChildren> = {
  readonly layers: Layer<P>[];
  readonly children: ReactNode;
};
export const ComposedComponent = <P extends PropsWithChildren>(
  props: ComposedComponentProps<P>,
) => {
  const { layers, children } = props;

  const nextComposedComponent = layers.reduceRight((accChildren, nextLayer) => {
    const { Component, props: layerPropsWithoutChildren = EMPTY_PROPS } =
      nextLayer;

    const layerProps: P = {
      ...layerPropsWithoutChildren,
      children: accChildren,
    } as P;

    const nextAccChildren = <Component {...layerProps} />;

    return nextAccChildren;
  }, children);

  return nextComposedComponent;
};
