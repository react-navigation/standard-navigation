# Standard Navigation

A standard API for creating navigators that can work with multiple navigation libraries, such as React Navigation and Expo Router.

This package only contains minimal helpers and types. The actual implementation of integrating with this API should live in respective libraries (e.g. React Navigation, Expo Router, etc.).

## API

```tsx
import * as React from 'react';
import { createStandardNavigator } from 'standard-navigation';

type MyNavigatorOptions = {
  title?: string;
};

type MyNavigatorEventMap = {
  tabPress: {
    data: { isAlreadyFocused: boolean };
    canPreventDefault: true;
  };
};

type MyNavigatorProps = {
  className?: string;
};

const MyStandardNavigator = createStandardNavigator<
  MyNavigatorOptions,
  MyNavigatorEventMap,
  MyNavigatorProps
>(({ state, descriptors, actions, emitter, className }) => {
  return (
    <div className={className}>
      {state.routes.map((route, index) => (
        <React.Activity
          key={route.key}
          mode={state.index === index ? 'visible' : 'hidden'}
        >
          {descriptors[route.key].render()}
        </React.Activity>
      ))}
      {state.routes.map((route, index) => (
        <a
          href={route.href}
          key={route.key}
          onClick={(e) => {
            e.preventDefault();

            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
              data: {
                isAlreadyFocused: state.index === index,
              },
            });

            if (event.defaultPrevented) {
              return;
            }

            actions.navigate(route.name, route.params);
          }}
        >
          {descriptors[route.key].options.title}
        </a>
      ))}
    </div>
  );
});
```

A navigator is created by calling `createStandardNavigator` with a function. It can be typed with three generics:

- `NavigatorOptions`: The options for each route descriptor.
- `NavigatorEventMap`: The events that can be emitted by the navigator.
- `NavigatorProps`: Additional props accepted by the navigator content.

It returns an object as follows:

```ts
{
  type: 'standard',
  version: 1,
  NavigatorContent: React.ComponentType,
}
```

This object can be used by helpers exported from libraries like React Navigation and Expo Router to create navigators to use in those libraries. Refer to the documentation of those libraries for more details on how to use this API with them.

The callback function receives an object with the following properties:

### `state`

The current navigation state:

- `index`: The index of the currently focused route in `routes`.
- `routes`: An array of route objects, each containing the following properties:
  - `key`: A unique key for the route.
  - `name`: The name of the route.
  - `params`: An optional object of params for the route.
  - `href`: An href for the route, used for web navigation, or `undefined` if unavailable.

### `descriptors`

An object mapping each route's `key` to a descriptor for that route:

- `options`: The options for the route, e.g. `title`.
- `render`: A function that returns the React element to render for the route.

### `actions`

An object of navigation actions that the navigator can perform:

- `navigate`: Navigates to a route. Accepts `name` and `params` to navigate by route name and params.
- `back`: Goes back to the previous route in history.

### `emitter`

An event emitter that can be used to emit events. Calling `emit` accepts an object with the following properties:

- `type`: The type of the event (e.g. `tabPress`).
- `target`: An optional key of the route which is the target of the event.
- `canPreventDefault`: When the event allows preventing the default action, set this to `true` to enable `event.preventDefault()` on the returned event.
- `data`: Data associated with the event. This is optional when the event's data type includes `undefined`.

The returned event object contains a `defaultPrevented` boolean (when `canPreventDefault` is `true`) which can be used to check whether `event.preventDefault()` was called by a listener.
