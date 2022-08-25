import * as React from 'react';
import type { DialogProps as IDialogPropTypes } from 'rc-dialog';
import Dialog from 'rc-dialog';
import classnames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import KeyCode from 'rc-util/lib/KeyCode';
import { warning } from 'rc-util/lib/warning';
import useFrameSetState from './hooks/useFrameSetState';
import getFixScaleEleTransPosition from './getFixScaleEleTransPosition';
import { context } from './PreviewGroup';

const { useState, useEffect, useCallback, useRef, useContext } = React;

export interface PreviewProps extends Omit<IDialogPropTypes, 'onClose'> {
  onClose?: (e: React.SyntheticEvent<Element>) => void;
  src?: string;
  alt?: string;
  rootClassName?: string;
  icons?: {
    rotateLeft?: React.ReactNode;
    rotateRight?: React.ReactNode;
    zoomIn?: React.ReactNode;
    zoomOut?: React.ReactNode;
    close?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
  };
  countRender?: (current: number, total: number) => string;
  scaleStep?: number;
}

const initialPosition = {
  x: 0,
  y: 0,
};

const Preview: React.FC<PreviewProps> = props => {
  const {
    prefixCls,
    src,
    alt,
    onClose,
    afterClose,
    visible,
    icons = {},
    rootClassName,
    countRender,
    scaleStep = 0.5,
    ...restProps
  } = props;
  const { rotateLeft, rotateRight, zoomIn, zoomOut, close, left, right } = icons;
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useFrameSetState<{
    x: number;
    y: number;
  }>(initialPosition);
  const imgRef = useRef<HTMLImageElement>();
  const originPositionRef = useRef<{
    originX: number;
    originY: number;
    deltaX: number;
    deltaY: number;
  }>({
    originX: 0,
    originY: 0,
    deltaX: 0,
    deltaY: 0,
  });
  const [isMoving, setMoving] = useState(false);
  const { previewUrls, current, isPreviewGroup, setCurrent } = useContext(context);
  const previewGroupCount = previewUrls.size;
  const previewUrlsKeys = Array.from(previewUrls.keys());
  const currentPreviewIndex = previewUrlsKeys.indexOf(current);
  const combinationSrc = isPreviewGroup ? previewUrls.get(current) : src;
  const showLeftOrRightSwitches = isPreviewGroup && previewGroupCount > 1;
  const [lastWheelZoomDirection, setLastWheelZoomDirection] = useState({ wheelDirection: 0 });

  const onAfterClose = () => {
    setScale(1);
    setRotate(0);
    setPosition(initialPosition);
  };

  const onZoomIn = () => {
    setScale(value => value + scaleStep);
    setPosition(initialPosition);
  };

  const onZoomOut = () => {
    if (scale > 1) {
      setScale(value => value - scaleStep);
    }
    setPosition(initialPosition);
  };

  const onRotateRight = () => {
    setRotate(value => value + 90);
  };

  const onRotateLeft = () => {
    setRotate(value => value - 90);
  };

  const onSwitchLeft: React.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
    // Without this mask close will abnormal
    event.stopPropagation();
    if (currentPreviewIndex > 0) {
      setCurrent(previewUrlsKeys[currentPreviewIndex - 1]);
    }
  };

  const onSwitchRight: React.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
    // Without this mask close will abnormal
    event.stopPropagation();
    if (currentPreviewIndex < previewGroupCount - 1) {
      setCurrent(previewUrlsKeys[currentPreviewIndex + 1]);
    }
  };

  const wrapClassName = classnames({
    [`${prefixCls}-moving`]: isMoving,
  });
  const toolClassName = `${prefixCls}-operations-operation`;
  const iconClassName = `${prefixCls}-operations-icon`;
  const tools = [
    {
      icon: close,
      onClick: onClose,
      type: 'close',
    },
    {
      icon: zoomIn,
      onClick: onZoomIn,
      type: 'zoomIn',
    },
    {
      icon: zoomOut,
      onClick: onZoomOut,
      type: 'zoomOut',
      disabled: scale === 1,
    },
    {
      icon: rotateRight,
      onClick: onRotateRight,
      type: 'rotateRight',
    },
    {
      icon: rotateLeft,
      onClick: onRotateLeft,
      type: 'rotateLeft',
    },
  ];

  const onMouseUp: React.MouseEventHandler<HTMLBodyElement> = () => {
    if (visible && isMoving) {
      const width = imgRef.current.offsetWidth * scale;
      const height = imgRef.current.offsetHeight * scale;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { left, top } = imgRef.current.getBoundingClientRect();
      const isRotate = rotate % 180 !== 0;

      setMoving(false);

      const fixState = getFixScaleEleTransPosition(
        isRotate ? height : width,
        isRotate ? width : height,
        left,
        top,
      );

      if (fixState) {
        setPosition({ ...fixState });
      }
    }
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    // Only allow main button
    if (event.button !== 0) return;
    event.preventDefault();
    // Without this mask close will abnormal
    event.stopPropagation();
    originPositionRef.current.deltaX = event.pageX - position.x;
    originPositionRef.current.deltaY = event.pageY - position.y;
    originPositionRef.current.originX = position.x;
    originPositionRef.current.originY = position.y;
    setMoving(true);
  };

  const onMouseMove: React.MouseEventHandler<HTMLBodyElement> = event => {
    if (visible && isMoving) {
      setPosition({
        x: event.pageX - originPositionRef.current.deltaX,
        y: event.pageY - originPositionRef.current.deltaY,
      });
    }
  };

  const onWheelMove: React.WheelEventHandler<HTMLBodyElement> = event => {
    if (!visible) return;
    event.preventDefault();
    const wheelDirection = event.deltaY;
    setLastWheelZoomDirection({ wheelDirection });
  };

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!visible || !showLeftOrRightSwitches) return;

      event.preventDefault();
      if (event.keyCode === KeyCode.LEFT) {
        if (currentPreviewIndex > 0) {
          setCurrent(previewUrlsKeys[currentPreviewIndex - 1]);
        }
      } else if (event.keyCode === KeyCode.RIGHT) {
        if (currentPreviewIndex < previewGroupCount - 1) {
          setCurrent(previewUrlsKeys[currentPreviewIndex + 1]);
        }
      }
    },
    [
      currentPreviewIndex,
      previewGroupCount,
      previewUrlsKeys,
      setCurrent,
      showLeftOrRightSwitches,
      visible,
    ],
  );

  const onDoubleClick = () => {
    if (visible) {
      if (scale !== 1) {
        setScale(1);
      }
      if (position.x !== initialPosition.x || position.y !== initialPosition.y) {
        setPosition(initialPosition);
      }
    }
  };

  useEffect(() => {
    const { wheelDirection } = lastWheelZoomDirection;
    if (wheelDirection > 0) {
      onZoomOut();
    } else if (wheelDirection < 0) {
      onZoomIn();
    }
  }, [lastWheelZoomDirection]);

  useEffect(() => {
    let onTopMouseUpListener;
    let onTopMouseMoveListener;

    const onMouseUpListener = addEventListener(window, 'mouseup', onMouseUp, false);
    const onMouseMoveListener = addEventListener(window, 'mousemove', onMouseMove, false);
    const onScrollWheelListener = addEventListener(window, 'wheel', onWheelMove, {
      passive: false,
    });
    const onKeyDownListener = addEventListener(window, 'keydown', onKeyDown, false);

    try {
      // Resolve if in iframe lost event
      /* istanbul ignore next */
      if (window.top !== window.self) {
        onTopMouseUpListener = addEventListener(window.top, 'mouseup', onMouseUp, false);
        onTopMouseMoveListener = addEventListener(window.top, 'mousemove', onMouseMove, false);
      }
    } catch (error) {
      /* istanbul ignore next */
      warning(false, `[rc-image] ${error}`);
    }

    return () => {
      onMouseUpListener.remove();
      onMouseMoveListener.remove();
      onScrollWheelListener.remove();
      onKeyDownListener.remove();

      /* istanbul ignore next */
      if (onTopMouseUpListener) onTopMouseUpListener.remove();
      /* istanbul ignore next */
      if (onTopMouseMoveListener) onTopMouseMoveListener.remove();
    };
  }, [visible, isMoving, onKeyDown]);

  return (
    <Dialog
      transitionName="zoom"
      maskTransitionName="fade"
      closable={false}
      keyboard
      prefixCls={prefixCls}
      onClose={onClose}
      afterClose={onAfterClose}
      visible={visible}
      wrapClassName={wrapClassName}
      rootClassName={rootClassName}
      {...restProps}
    >
      <ul className={`${prefixCls}-operations`}>
        {showLeftOrRightSwitches && (
          <li className={`${prefixCls}-operations-progress`}>
            {countRender?.(currentPreviewIndex + 1, previewGroupCount) ??
              `${currentPreviewIndex + 1} / ${previewGroupCount}`}
          </li>
        )}
        {tools.map(({ icon, onClick, type, disabled }) => (
          <li
            className={classnames(toolClassName, {
              [`${prefixCls}-operations-operation-disabled`]: !!disabled,
            })}
            onClick={onClick}
            key={type}
          >
            {React.isValidElement(icon)
              ? React.cloneElement(icon, { className: iconClassName })
              : icon}
          </li>
        ))}
      </ul>
      <div
        className={`${prefixCls}-img-wrapper`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      >
        <img
          width={props.width}
          height={props.height}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
          ref={imgRef}
          className={`${prefixCls}-img`}
          src={combinationSrc}
          alt={alt}
          style={{ transform: `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)` }}
        />
      </div>
      {showLeftOrRightSwitches && (
        <div
          className={classnames(`${prefixCls}-switch-left`, {
            [`${prefixCls}-switch-left-disabled`]: currentPreviewIndex === 0,
          })}
          onClick={onSwitchLeft}
        >
          {left}
        </div>
      )}
      {showLeftOrRightSwitches && (
        <div
          className={classnames(`${prefixCls}-switch-right`, {
            [`${prefixCls}-switch-right-disabled`]: currentPreviewIndex === previewGroupCount - 1,
          })}
          onClick={onSwitchRight}
        >
          {right}
        </div>
      )}
    </Dialog>
  );
};

export default Preview;
