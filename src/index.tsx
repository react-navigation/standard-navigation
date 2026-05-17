export type NavigatorEventArg<
  EventName,
  CanPreventDefault extends boolean | undefined = false,
  Data = undefined,
> = {
  /**
   * Type of the event (e.g. `tabPress`)
   */
  readonly type: EventName;
  /**
   * Key of the route which received the event.
   */
  readonly target?: string | undefined;
} & (CanPreventDefault extends true
  ? {
      /**
       * Whether `event.preventDefault()` was called on this event object.
       */
      readonly defaultPrevented: boolean;
      /**
       * Prevent the default action which happens on this event.
       */
      preventDefault(): void;
    }
  : {}) &
  (undefined extends Data
    ? { readonly data?: Readonly<Data> | undefined }
    : { readonly data: Readonly<Data> });

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

type NavigatorEventMapBase = Record<
  string,
  {
    data: object | undefined;
    canPreventDefault: boolean;
  }
>;

export type NavigatorArgs<
  NavigatorOptions extends {},
  NavigatorEventMap extends NavigatorEventMapBase,
> = {
  state: NavigatorState;
  descriptors: Record<string, NavigatorDescriptor<NavigatorOptions>>;
  actions: {
    navigate(
      options:
        | {
            name: string;
            params?: object | undefined;
          }
        | { key: string },
    ): void;
  };
  emitter: {
    emit<EventName extends keyof NavigatorEventMap>(
      options: {
        type: EventName;
        target?: string;
      } & (NavigatorEventMap[EventName]["canPreventDefault"] extends true
        ? { canPreventDefault: true }
        : {}) &
        (undefined extends NavigatorEventMap[EventName]["data"]
          ? { data?: NavigatorEventMap[EventName]["data"] }
          : { data: NavigatorEventMap[EventName]["data"] }),
    ): NavigatorEventArg<
      EventName,
      NavigatorEventMap[EventName]["canPreventDefault"],
      NavigatorEventMap[EventName]["data"]
    >;
  };
};

export function createStandardNavigator<
  NavigatorOptions extends {},
  NavigatorEventMap extends NavigatorEventMapBase,
  NavigatorProps extends object = {},
>(
  render: (
    options: NavigatorArgs<NavigatorOptions, NavigatorEventMap> &
      Omit<
        NavigatorProps,
        keyof NavigatorArgs<NavigatorOptions, NavigatorEventMap>
      >,
  ) => React.ReactNode,
) {
  return {
    type: "standard",
    render,
  };
}
