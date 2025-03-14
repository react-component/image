import { warning } from '@rc-component/util/lib/warning';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import getFixScaleEleTransPosition from '../getFixScaleEleTransPosition';
import { BASE_SCALE_RATIO, WHEEL_MAX_SCALE_RATIO } from '../previewConfig';
import type {
  DispatchZoomChangeFunc,
  TransformType,
  UpdateTransformFunc,
} from './useImageTransform';

export default function useMouseEvent(
  imgRef: React.MutableRefObject<HTMLImageElement>,
  movable: boolean,
  open: boolean,
  scaleStep: number,
  transform: TransformType,
  updateTransform: UpdateTransformFunc,
  dispatchZoomChange: DispatchZoomChangeFunc,
) {
  const { rotate, scale, x, y } = transform;

  const [isMoving, setMoving] = useState(false);
  const startPositionInfo = useRef({
    diffX: 0,
    diffY: 0,
    transformX: 0,
    transformY: 0,
  });

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    // Only allow main button
    if (!movable || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    startPositionInfo.current = {
      diffX: event.pageX - x,
      diffY: event.pageY - y,
      transformX: x,
      transformY: y,
    };
    setMoving(true);
  };

  const onMouseMove = (event: MouseEvent) => {
    if (open && isMoving) {
      updateTransform(
        {
          x: event.pageX - startPositionInfo.current.diffX,
          y: event.pageY - startPositionInfo.current.diffY,
        },
        'move',
      );
    }
  };

  const onMouseUp = () => {
    if (open && isMoving) {
      setMoving(false);

      /** No need to restore the position when the picture is not moved, So as not to interfere with the click */
      const { transformX, transformY } = startPositionInfo.current;
      const hasChangedPosition = x !== transformX && y !== transformY;
      if (!hasChangedPosition) return;

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
    }
  };

  const onWheel = (event: React.WheelEvent<HTMLImageElement>) => {
    if (!open || event.deltaY == 0) return;
    // Scale ratio depends on the deltaY size
    const scaleRatio = Math.abs(event.deltaY / 100);
    // Limit the maximum scale ratio
    const mergedScaleRatio = Math.min(scaleRatio, WHEEL_MAX_SCALE_RATIO);
    // Scale the ratio each time
    let ratio = BASE_SCALE_RATIO + mergedScaleRatio * scaleStep;
    if (event.deltaY > 0) {
      ratio = BASE_SCALE_RATIO / ratio;
    }
    dispatchZoomChange(ratio, 'wheel', event.clientX, event.clientY);
  };

  useEffect(() => {
    if (movable) {
      window.addEventListener('mouseup', onMouseUp, false);
      window.addEventListener('mousemove', onMouseMove, false);

      try {
        // Resolve if in iframe lost event
        /* istanbul ignore next */
        if (window.top !== window.self) {
          window.top.addEventListener('mouseup', onMouseUp, false);
          window.top.addEventListener('mousemove', onMouseMove, false);
        }
      } catch (error) {
        /* istanbul ignore next */
        warning(false, `[rc-image] ${error}`);
      }
    }

    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      // /* istanbul ignore next */
      window.top?.removeEventListener('mouseup', onMouseUp);
      // /* istanbul ignore next */
      window.top?.removeEventListener('mousemove', onMouseMove);
    };
  }, [open, isMoving, x, y, rotate, movable]);

  return {
    isMoving,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
  };
}
