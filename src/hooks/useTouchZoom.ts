import { useCallback, useRef } from 'react';
import type { TransformAction, TransformType } from './useImageTransform';

export default function useTouchZoom(
  updateTransform: (newTransform: Partial<TransformType>, action: TransformAction) => void,
  currentScale: number,
) {
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

  const onTouchStart = useCallback(
    (event: React.TouchEvent<HTMLImageElement>) => {
      const { touches = [] } = event;
      if (touches.length > 1) {
        setTouchPoint(touches[0].pageY, touches[1].pageY);
      }
    },
    [setTouchPoint],
  );

  const onTouchMove = (event: React.TouchEvent<HTMLImageElement>) => {
    const { touches = [] } = event;
    const { touchOne, touchTwo, touchdown } = touchPointInfo.current;

    if (touchdown) {
      const pageY_1 = touches[0]?.pageY;
      const pageY_2 = touches[1]?.pageY;
      let needChange = false;

      if (Math.abs(touchOne - pageY_1) > 10 || Math.abs(touchTwo - pageY_2) > 10) {
        needChange = true;
      }

      if (needChange) {
        if (Math.abs(touchOne - touchTwo) > Math.abs(pageY_1 - pageY_2)) {
          if (currentScale <= 1) return;
          updateTransform(
            { x: 0, y: 0, scale: currentScale - 0.3 < 1 ? 1 : currentScale - 0.3 },
            'touchZoom',
          );
        } else {
          updateTransform({ x: 0, y: 0, scale: currentScale + 0.2 }, 'touchZoom');
        }

        setTouchPoint(pageY_1, pageY_2);
      }
    }
  };

  return {
    touchPointInfo: touchPointInfo.current,
    onTouchRest: restTouchPoint,
    onTouchStart,
    onTouchMove,
  };
}
