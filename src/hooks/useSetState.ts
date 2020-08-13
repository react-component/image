import * as React from 'react';

export type SetActionType<T> = Partial<T> | ((state: T) => Partial<T>);

export default function useSetState<T extends object>(
  initial?: T,
): [T, (newState: SetActionType<T>) => void] {
  const [state, setState] = React.useState<T>(initial);

  const setStates = (newState: SetActionType<T>) => {
    if (typeof newState === 'function') {
      setState(oldState => ({
        ...oldState,
        ...newState(oldState),
      }));
    } else {
      setState(oldState => ({ ...oldState, ...newState }));
    }
  };

  return [state, setStates];
}
