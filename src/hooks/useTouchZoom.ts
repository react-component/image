import { useCallback, useEffect, useRef } from 'react';
import type { Transform, TransformAction, TransformType } from './useImageTransform';

type Point = {
  x: number;
  y: number;
};
type EventType = 'init' | 'zoom' | 'move';

let lastTouchEnd = 0;
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

function touchstart(event: TouchEvent) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}

function touchend(event: TouchEvent) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}

/** Prohibit WeChat sliding & Prohibit browser scaling  */
function slidingControl(stop: boolean) {
  const body = document.getElementsByTagName('body')[0];

  if (stop) {
    body.style.position = 'fixed';
    body.style.top = '0';
    body.style.bottom = '0';
    body.style.overflow = 'hidden';

    document.addEventListener('touchstart', touchstart, {
      passive: false,
    });
    document.addEventListener('touchend', touchend, {
      passive: false,
    });
  } else {
    body.style.position = null;
    body.style.top = null;
    body.style.bottom = null;
    body.style.overflow = null;

    document.removeEventListener('touchstart', touchstart);
    document.removeEventListener('touchend', touchend);
  }
}

/** Pinch-to-zoom & Move image after zooming in */
export default function useTouchZoom(
  updateTransform: (newTransform: Partial<TransformType>, action: TransformAction) => void,
  dispatchZoomChange: (
    ratio: number,
    action: TransformAction,
    clientX?: number,
    clientY?: number,
  ) => void,
  transform: Transform,
  visible: boolean,
  imgRef: React.MutableRefObject<HTMLImageElement>,
) {
  const touchPointInfo = useRef<{ touchOne: Point; touchTwo: Point; eventType: EventType }>({
    touchOne: { ...initPoint },
    touchTwo: { ...initPoint },
    eventType: 'init',
  });

  const setTouchPoint = useCallback((a: Point, b: Point, eventType: EventType) => {
    touchPointInfo.current.touchOne = a;
    touchPointInfo.current.touchTwo = b;
    touchPointInfo.current.eventType = eventType;
  }, []);

  const restTouchPoint = (event: React.TouchEvent<HTMLImageElement>) => {
    const { touches = [] } = event;
    if (touches.length) return;
    setTouchPoint({ ...initPoint }, { ...initPoint }, 'init');
  };

  const onTouchStart = useCallback(
    (event: React.TouchEvent<HTMLImageElement>) => {
      const { touches = [] } = event;
      if (touches.length > 1) {
        // touch zoom
        setTouchPoint(
          { x: touches[0].pageX, y: touches[0].pageY },
          { x: touches[1].pageX, y: touches[1].pageY },
          'zoom',
        );
      } else {
        // touch move
        setTouchPoint(
          {
            x: touches[0].pageX - transform.x,
            y: touches[0].pageY - transform.y,
          },
          { ...initPoint },
          'move',
        );
      }
    },
    [setTouchPoint, transform],
  );

  const onTouchMove = (event: React.TouchEvent<HTMLImageElement>) => {
    const { touches = [] } = event;
    const { touchOne, touchTwo, eventType } = touchPointInfo.current;

    const oldPoint = {
      a: { x: touchOne.x, y: touchOne.y },
      b: { x: touchTwo.x, y: touchTwo.y },
    };
    const newPoint = {
      a: { x: touches[0]?.pageX, y: touches[0]?.pageY },
      b: { x: touches[1]?.pageX, y: touches[1]?.pageY },
    };

    if (eventType === 'zoom') {
      const [x, y] = getCenter(newPoint.a, newPoint.b);
      const ratio = getDistance(newPoint.a, newPoint.b) / getDistance(oldPoint.a, oldPoint.b);

      if (ratio > 0.2) {
        dispatchZoomChange(ratio, 'touchZoom', x, y);
        setTouchPoint(newPoint.a, newPoint.b, 'zoom');
      }
    } else if (eventType === 'move' && transform.scale > 1) {
      const { width, height } = imgRef.current;
      const { x, y, scale } = transform;

      let newX = x;
      let newY = y;

      if (width * scale > document.documentElement.clientWidth) {
        newX = newPoint.a.x - oldPoint.a.x;
      }

      if (height * scale > document.documentElement.clientHeight) {
        newY = newPoint.a.y - oldPoint.a.y;
      }

      updateTransform(
        {
          x: newX,
          y: newY,
        },
        'move',
      );
    }
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLImageElement>) => {
    const { x, y, scale } = transform;
    const { width, height } = imgRef.current;
    
    let newX = x;
    let newY = y;

    if (width * scale > document.documentElement.clientWidth) {
      const offset = (width * (scale - 1)) / 2;

      if (x > offset) {
        newX = offset;
      } else if (x < -offset) {
        newX = -offset;
      }
    }

    if (height * scale > document.documentElement.clientHeight) {
      const offset = (height * scale - document.documentElement.clientHeight) / 2;

      if (y > offset) {
        newY = offset;
      } else if (y < -offset) {
        newY = -offset;
      }
    }

    updateTransform({ x: newX, y: newY }, 'move');
    restTouchPoint(event);
  };

  useEffect(() => {
    if (visible) {
      slidingControl(true);
    } else {
      slidingControl(false);
    }
  }, [visible]);

  return {
    touchPointInfo: touchPointInfo.current,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel: restTouchPoint,
  };
}
