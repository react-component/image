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

/** Prohibit WeChat sliding & Prohibit browser scaling  */
function touchstart(event: TouchEvent) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}
function touchmove(event: TouchEvent) {
  event.preventDefault();
}
function touchend(event: TouchEvent) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}
function slidingControl(stop: boolean, className: string) {
  const containerEle = document.getElementsByClassName(className)?.[0] as HTMLElement;

  if (stop) {
    if (containerEle) {
      containerEle.parentElement.addEventListener('touchmove', touchmove, {
        passive: false,
      });
      containerEle.addEventListener('touchmove', touchmove, {
        passive: false,
      });
    }

    document.addEventListener('touchstart', touchstart, {
      passive: false,
    });
    document.addEventListener('touchend', touchend, {
      passive: false,
    });
  } else {
    if (containerEle) {
      containerEle.parentElement.removeEventListener('touchmove', touchmove);
      containerEle.removeEventListener('touchmove', touchmove);
    }

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
  prefixCls: string,
) {
  const { x: translateX, y: translateY, scale } = transform;
  const { width: imgWidth, height: imgHeight } = imgRef.current || { width: 0, height: 0 };

  const getTranslateLimit = () => {
    const offsetX = (imgWidth * scale - document.documentElement.clientWidth) / 2;
    const offsetY = (imgHeight * scale - document.documentElement.clientHeight) / 2;
    return [offsetX, offsetY];
  };

  const getOverflow = () => {
    return [
      imgWidth * scale > document.documentElement.clientWidth,
      imgHeight * scale > document.documentElement.clientHeight,
    ];
  };

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
          { x: touches[0].clientX, y: touches[0].clientY },
          { x: touches[1].clientX, y: touches[1].clientY },
          'zoom',
        );
      } else {
        // touch move
        setTouchPoint(
          {
            x: touches[0].clientX - transform.x,
            y: touches[0].clientY - transform.y,
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
      a: { x: touches[0]?.clientX, y: touches[0]?.clientY },
      b: { x: touches[1]?.clientX, y: touches[1]?.clientY },
    };

    if (eventType === 'zoom' && touches.length > 1) {
      const [x, y] = getCenter(newPoint.a, newPoint.b);
      const ratio = getDistance(newPoint.a, newPoint.b) / getDistance(oldPoint.a, oldPoint.b);
      
      dispatchZoomChange(ratio, 'touchZoom', x, y);
      setTouchPoint(newPoint.a, newPoint.b, 'zoom');
    } else if (eventType === 'move') {
      updateTransform(
        {
          x: newPoint.a.x - oldPoint.a.x,
          y: newPoint.a.y - oldPoint.a.y,
        },
        'move',
      );
    }
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLImageElement>) => {
    const [offsetX, offsetY] = getTranslateLimit();
    const [xOverflow, yOverflow] = getOverflow();

    let newX = translateX;
    let newY = translateY;

    if (xOverflow) {
      if (translateX > offsetX) {
        newX = offsetX;
      } else if (translateX < -offsetX) {
        newX = -offsetX;
      }
    } else {
      newX = 0;
    }

    if (yOverflow) {
      if (translateY > offsetY) {
        newY = offsetY;
      } else if (translateY < -offsetY) {
        newY = -offsetY;
      }
    } else {
      newY = 0;
    }

    updateTransform({ x: newX, y: newY }, 'move');
    restTouchPoint(event);
  };

  useEffect(() => {
    if (visible) {
      slidingControl(true, prefixCls + '-mask');
    } else {
      slidingControl(false, prefixCls + '-mask');
    }
  }, [visible, prefixCls]);

  return {
    touchPointInfo: touchPointInfo.current,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel: restTouchPoint,
  };
}
