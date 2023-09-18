import { useCallback, useRef } from 'react';
import type { TransformAction, TransformType } from './useImageTransform';

interface Point {
  x: number;
  y: number;
}

const initPoint = { x: 0, y: 0 };

function getDistance(a: Point, b: Point) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.hypot(x, y);
}

function getCenter(a: Point, b: Point) {
  const x = (a.x + b.x) / 2;
  const y = (a.y + b.y) / 2;
  return [x, y];
}

export default function useTouchZoom(
  updateTransform: (newTransform: Partial<TransformType>, action: TransformAction) => void,
  dispatchZoomChange: (
    ratio: number,
    action: TransformAction,
    clientX?: number,
    clientY?: number,
  ) => void,
  transform: any,
) {
  const touchPointInfo = useRef({
    touchOne: { ...initPoint },
    touchTwo: { ...initPoint },
    noZoom: false,
  });

  const setTouchPoint = useCallback((a: Point, b: Point, noZoom: boolean = true) => {
    touchPointInfo.current.touchOne = a;
    touchPointInfo.current.touchTwo = b;
    touchPointInfo.current.noZoom = noZoom;
  }, []);

  const restTouchPoint = useCallback(
    event => {
      const { touches = [] } = event;
      if (touches.length) return;

      setTouchPoint({ ...initPoint }, { ...initPoint }, false);
    },
    [setTouchPoint],
  );

  const onTouchStart = useCallback(
    (event: React.TouchEvent<HTMLImageElement>) => {
      const { touches = [] } = event;
      if (touches.length > 1) {
        setTouchPoint(
          { x: touches[0].pageX, y: touches[0].pageY },
          { x: touches[1].pageX, y: touches[1].pageY },
        );
      } else {
        setTouchPoint(
          {
            x: touches[0].screenX - transform.x,
            y: touches[0].screenY - transform.y,
          },
          { ...initPoint },
          false,
        );
      }
    },
    [setTouchPoint, transform],
  );

  const onTouchMove = (event: React.TouchEvent<HTMLImageElement>) => {
    const { touches = [] } = event;
    const { touchOne, touchTwo, noZoom } = touchPointInfo.current;

    if (touches.length > 1) {
      const { pageX: pageX_1, pageY: pageY_1 } = touches?.[0];
      const { pageX: pageX_2, pageY: pageY_2 } = touches?.[1];

      const oldPoint = {
        a: { x: touchOne.x, y: touchOne.y },
        b: { x: touchTwo.x, y: touchTwo.y },
      };
      const newPoint = {
        a: { x: pageX_1, y: pageY_1 },
        b: { x: pageX_2, y: pageY_2 },
      };

      const [x, y] = getCenter(newPoint.a, newPoint.b);
      const ratio = getDistance(newPoint.a, newPoint.b) / getDistance(oldPoint.a, oldPoint.b);

      if (ratio > 0.2) {
        dispatchZoomChange(ratio, 'touchZoom', x, y);
        setTouchPoint(newPoint.a, newPoint.b, true);
      }
    } else if (transform.scale > 1 && !noZoom) {
      updateTransform(
        {
          x: touches[0].screenX - touchOne.x,
          y: touches[0].screenY - touchOne.y,
        },
        'move',
      );
    }
  };

  return {
    touchPointInfo: touchPointInfo.current,
    onTouchRest: restTouchPoint,
    onTouchStart,
    onTouchMove,
  };
}
