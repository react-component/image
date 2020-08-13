import * as React from 'react';
import useSetState, { SetActionType } from './useSetState';

export default function useFrameSetState<T extends object>(
  initial: T,
): [T, (newState: SetActionType<T>) => void] {
  const frame = React.useRef(null);
  const [state, setState] = useSetState(initial);

  const queue = React.useRef<SetActionType<T>[]>([]);

  const setFrameState = (newState: SetActionType<T>) => {
    if (frame.current === null) {
      queue.current = [];
      frame.current = requestAnimationFrame(() => {
        setState(preState => {
          let memoState: any = preState;
          queue.current.forEach(queueState => {
            memoState = { ...memoState, ...queueState };
          });
          frame.current = null;

          return memoState;
        });
      });
    }

    queue.current.push(newState);
  };

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return [state, setFrameState];
}
