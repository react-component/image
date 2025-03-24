import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import getFixScaleEleTransPosition from '../getFixScaleEleTransPosition';
import type {
  DispatchZoomChangeFunc,
  TransformType,
  UpdateTransformFunc,
} from './useImageTransform';

type Point = {
  x: number;
  y: number;
};

type TouchPointInfoType = {
  point1: Point;
  point2: Point;
  eventType: string;
};

function getDistance(a: Point, b: Point) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.hypot(x, y);
}

function getCenter(oldPoint1: Point, oldPoint2: Point, newPoint1: Point, newPoint2: Point) {
  // Calculate the distance each point has moved
  const distance1 = getDistance(oldPoint1, newPoint1);
  const distance2 = getDistance(oldPoint2, newPoint2);

  // If both distances are 0, return the original points
  if (distance1 === 0 && distance2 === 0) {
    return [oldPoint1.x, oldPoint1.y];
  }

  // Calculate the ratio of the distances
  const ratio = distance1 / (distance1 + distance2);

  // Calculate the new center point based on the ratio
  const x = oldPoint1.x + ratio * (oldPoint2.x - oldPoint1.x);
  const y = oldPoint1.y + ratio * (oldPoint2.y - oldPoint1.y);

  return [x, y];
}

export default function useTouchEvent(
  imgRef: React.MutableRefObject<HTMLImageElement>,
  movable: boolean,
  open: boolean,
  minScale: number,
  transform: TransformType,
  updateTransform: UpdateTransformFunc,
  dispatchZoomChange: DispatchZoomChangeFunc,
) {
  const { rotate, scale, x, y } = transform;

  const [isTouching, setIsTouching] = useState(false);
  const touchPointInfo = useRef<TouchPointInfoType>({
    point1: { x: 0, y: 0 },
    point2: { x: 0, y: 0 },
    eventType: 'none',
  });

  const updateTouchPointInfo = (values: Partial<TouchPointInfoType>) => {
    touchPointInfo.current = {
      ...touchPointInfo.current,
      ...values,
    };
  };

  const onTouchStart = (event: React.TouchEvent<HTMLImageElement>) => {
    if (!movable) return;
    event.stopPropagation();
    setIsTouching(true);

    const { touches = [] } = event;
    if (touches.length > 1) {
      // touch zoom
      updateTouchPointInfo({
        point1: { x: touches[0].clientX, y: touches[0].clientY },
        point2: { x: touches[1].clientX, y: touches[1].clientY },
        eventType: 'touchZoom',
      });
    } else {
      // touch move
      updateTouchPointInfo({
        point1: {
          x: touches[0].clientX - x,
          y: touches[0].clientY - y,
        },
        eventType: 'move',
      });
    }
  };

  const onTouchMove = (event: React.TouchEvent<HTMLImageElement>) => {
    const { touches = [] } = event;
    const { point1, point2, eventType } = touchPointInfo.current;

    if (touches.length > 1 && eventType === 'touchZoom') {
      // touch zoom
      const newPoint1 = {
        x: touches[0].clientX,
        y: touches[0].clientY,
      };
      const newPoint2 = {
        x: touches[1].clientX,
        y: touches[1].clientY,
      };
      const [centerX, centerY] = getCenter(point1, point2, newPoint1, newPoint2);
      const ratio = getDistance(newPoint1, newPoint2) / getDistance(point1, point2);

      dispatchZoomChange(ratio, 'touchZoom', centerX, centerY, true);
      updateTouchPointInfo({
        point1: newPoint1,
        point2: newPoint2,
        eventType: 'touchZoom',
      });
    } else if (eventType === 'move') {
      // touch move
      updateTransform(
        {
          x: touches[0].clientX - point1.x,
          y: touches[0].clientY - point1.y,
        },
        'move',
      );
      updateTouchPointInfo({ eventType: 'move' });
    }
  };

  const onTouchEnd = () => {
    if (!open) return;

    if (isTouching) {
      setIsTouching(false);
    }

    updateTouchPointInfo({ eventType: 'none' });

    if (minScale > scale) {
      /** When the scaling ratio is less than the minimum scaling ratio, reset the scaling ratio */
      return updateTransform({ x: 0, y: 0, scale: minScale }, 'touchZoom');
    }

    const width = imgRef.current.offsetWidth * scale;
    const height = imgRef.current.offsetHeight * scale;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { left, top } = imgRef.current.getBoundingClientRect();
    const isRotate = rotate % 180 !== 0;

    const fixState = getFixScaleEleTransPosition(
      isRotate ? height : width,
      isRotate ? width : height,
      left,
      top,
    );

    if (fixState) {
      updateTransform({ ...fixState }, 'dragRebound');
    }
  };

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };

    if (open && movable) {
      window.addEventListener('touchmove', preventDefault, {
        passive: false,
      });
    }
    return () => {
      window.removeEventListener('touchmove', preventDefault);
    };
  }, [open, movable]);

  return {
    isTouching,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
