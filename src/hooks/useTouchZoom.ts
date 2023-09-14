import { useCallback, useRef } from 'react';

export default function useTouchZoom() {
  const touchPositionRef = useRef({
    y_1: 0,
    y_2: 0,
    touchdown: false,
  });

  const rest = useCallback(() => {
    touchPositionRef.current.y_1 = 0;
    touchPositionRef.current.y_2 = 0;
    touchPositionRef.current.touchdown = false;
  }, []);

  const setMoveVal = useCallback((y_1: number, y_2: number) => {
    touchPositionRef.current.y_1 = y_1;
    touchPositionRef.current.y_2 = y_2;
    touchPositionRef.current.touchdown = true;
  }, []);

  return { touchPoints: touchPositionRef.current, rest, setMoveVal };
}
