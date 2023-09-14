import { useCallback, useRef } from 'react';

export default function useTouchZoom() {
  const touchPointInfo = useRef({
    touchOne: 0,
    touchTwo: 0,
    touchdown: false,
  });

  const restTouchPoint = useCallback(() => {
    touchPointInfo.current.touchOne = 0;
    touchPointInfo.current.touchTwo = 0;
    touchPointInfo.current.touchdown = false;
  }, []);

  const setTouchPoint = useCallback((touchOne: number, touchTwo: number) => {
    touchPointInfo.current.touchOne = touchOne;
    touchPointInfo.current.touchTwo = touchTwo;
    touchPointInfo.current.touchdown = true;
  }, []);

  return { touchPointInfo: touchPointInfo.current, restTouchPoint, setTouchPoint };
}
