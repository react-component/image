import * as React from 'react';
import Dialog, { DialogProps as IDialogPropTypes } from 'rc-dialog';
import RotateLeftOutlined from '@ant-design/icons/RotateLeftOutlined';
import RotateRightOutlined from '@ant-design/icons/RotateRightOutlined';
import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined';
import ZoomOutOutlined from '@ant-design/icons/ZoomOutOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import classnames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { getOffset } from 'rc-util/lib/Dom/css';
import { warning } from 'rc-util/lib/warning';
import useFrameSetState from './hooks/useFrameSetState';
import getFixScaleEleTransPosition from './getFixScaleEleTransPosition';
import { context } from './PreviewGroup';

const { useState, useEffect } = React;

interface PreviewProps extends Omit<IDialogPropTypes, 'onClose'> {
  onClose?: (e: React.SyntheticEvent<Element>) => void;
  src?: string;
  alt?: string;
}

const initialPosition = {
  x: 0,
  y: 0,
};

const Preview: React.FC<PreviewProps> = props => {
  const { prefixCls, src, alt, onClose, afterClose, visible, ...restProps } = props;
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useFrameSetState<{
    x: number;
    y: number;
  }>(initialPosition);
  const imgRef = React.useRef<HTMLImageElement>();
  const originPositionRef = React.useRef<{
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
  const [isMoving, setMoving] = React.useState(false);
  const { previewUrls, current, isPreviewGroup, setCurrent } = React.useContext(context);
  const previewGroupCount = previewUrls.size;
  const previewUrlsKeys = Array.from(previewUrls.keys());
  const currentPreviewIndex = previewUrlsKeys.indexOf(current);
  const combinationSrc = isPreviewGroup ? previewUrls.get(current) : src;
  const showLeftOrRightSwitches = isPreviewGroup && previewGroupCount > 1;
  const [lastWheelZoomDirection, setLastWheelZoomDirection] = React.useState({ wheelDirection: 0 });

  const onAfterClose = () => {
    setScale(1);
    setRotate(0);
    setPosition(initialPosition);
  };

  const onZoomIn = () => {
    setScale(value => value + 1);

    setPosition(initialPosition);
  };
  const onZoomOut = () => {
    if (scale > 1) {
      setScale(value => value - 1);
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
      Icon: CloseOutlined,
      onClick: onClose,
      type: 'close',
    },
    {
      Icon: ZoomInOutlined,
      onClick: onZoomIn,
      type: 'zoomIn',
    },
    {
      Icon: ZoomOutOutlined,
      onClick: onZoomOut,
      type: 'zoomOut',
      disabled: scale === 1,
    },
    {
      Icon: RotateRightOutlined,
      onClick: onRotateRight,
      type: 'rotateRight',
    },
    {
      Icon: RotateLeftOutlined,
      onClick: onRotateLeft,
      type: 'rotateLeft',
    },
  ];

  const onMouseUp: React.MouseEventHandler<HTMLBodyElement> = () => {
    if (visible && isMoving) {
      const width = imgRef.current.offsetWidth * scale;
      const height = imgRef.current.offsetHeight * scale;
      const { left, top } = getOffset(imgRef.current);
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

      /* istanbul ignore next */
      if (onTopMouseUpListener) onTopMouseUpListener.remove();
      /* istanbul ignore next */
      if (onTopMouseMoveListener) onTopMouseMoveListener.remove();
    };
  }, [visible, isMoving]);

  return (
    <Dialog
      {...restProps}
      transitionName="zoom"
      maskTransitionName="fade"
      closable={false}
      keyboard
      prefixCls={prefixCls}
      onClose={onClose}
      afterClose={onAfterClose}
      visible={visible}
      wrapClassName={wrapClassName}
    >
      <ul className={`${prefixCls}-operations`}>
        {tools.map(({ Icon, onClick, type, disabled }) => (
          <li
            className={classnames(toolClassName, {
              [`${prefixCls}-operations-operation-disabled`]: !!disabled,
            })}
            onClick={onClick}
            key={type}
          >
            <Icon className={iconClassName} />
          </li>
        ))}
      </ul>
      <div
        className={`${prefixCls}-img-wrapper`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        <img
          onMouseDown={onMouseDown}
          ref={imgRef}
          className={`${prefixCls}-img`}
          src={combinationSrc}
          alt={alt}
          style={{
            transform: `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`,
          }}
        />
      </div>
      {showLeftOrRightSwitches && (
        <div
          className={classnames(`${prefixCls}-switch-left`, {
            [`${prefixCls}-switch-left-disabled`]: currentPreviewIndex === 0,
          })}
          onClick={onSwitchLeft}
        >
          <LeftOutlined />
        </div>
      )}
      {showLeftOrRightSwitches && (
        <div
          className={classnames(`${prefixCls}-switch-right`, {
            [`${prefixCls}-switch-right-disabled`]: currentPreviewIndex === previewGroupCount - 1,
          })}
          onClick={onSwitchRight}
        >
          <RightOutlined />
        </div>
      )}
    </Dialog>
  );
};

export default Preview;
