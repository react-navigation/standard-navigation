import * as React from 'react';

export type NavigatorEvent<EventName, Data = undefined> = {
  /**
   * Type of the event (e.g. `tabPress`)
   */
  readonly type: EventName;
  /**
   * Key of the route which received the event.
   */
  readonly target?: string;
  /**
   * Whether `event.preventDefault()` was called on this event object.
   */
  readonly defaultPrevented?: boolean;
  /**
   * Prevent the default action which happens on this event.
   */
  preventDefault?(): void;
  /**
   * Data associated with the event.
   */
  readonly data?: Data;
};

export type NavigatorRoute = {
  key: string;
  name: string;
  params?: object | undefined;
  href: string | undefined;
};

export type NavigatorState = {
  index: number;
  routes: NavigatorRoute[];
};

export type NavigatorDescriptor<NavigatorOptions extends {}> = {
  options: NavigatorOptions;
  render: () => React.ReactNode;
};

export type NavigatorEventMapBase = Record<
  string,
  {
    data: object | undefined;
  }
>;

export type NavigatorArgs<
  NavigatorOptions extends {},
  NavigatorEventMap extends NavigatorEventMapBase,
> = {
  state: NavigatorState;
  descriptors: Record<string, NavigatorDescriptor<NavigatorOptions>>;
  actions: {
    navigate(name: string, params?: object | undefined): void;
    back(): void;
  };
  emitter: {
    emit<EventName extends keyof NavigatorEventMap>(
      options: {
        type: EventName;
        target?: string;
        canPreventDefault?: boolean;
        data?: NavigatorEventMap[EventName]['data'];
      },
    ): NavigatorEvent<EventName, NavigatorEventMap[EventName]['data']>;
  };
};

export type StandardNavigatorContent<
  NavigatorOptions extends {},
  NavigatorEventMap extends NavigatorEventMapBase,
  NavigatorProps extends object = {},
> = React.ComponentType<
  NavigatorArgs<NavigatorOptions, NavigatorEventMap> &
    Omit<NavigatorProps, keyof NavigatorArgs<NavigatorOptions, NavigatorEventMap>>
>;

export type StandardNavigator<
  NavigatorOptions extends {},
  NavigatorEventMap extends NavigatorEventMapBase,
  NavigatorProps extends object = {},
> = {
  readonly type: 'standard';
  readonly version: 1;
  readonly NavigatorContent: StandardNavigatorContent<
    NavigatorOptions,
    NavigatorEventMap,
    NavigatorProps
  >;
};

export function createStandardNavigator<
  NavigatorOptions extends {},
  NavigatorEventMap extends NavigatorEventMapBase,
  NavigatorProps extends object = {},
>(
  NavigatorContent: StandardNavigatorContent<
    NavigatorOptions,
    NavigatorEventMap,
    NavigatorProps
  >,
): StandardNavigator<NavigatorOptions, NavigatorEventMap, NavigatorProps> {
  return {
    type: 'standard',
    version: 1,
    NavigatorContent,
  };
}
