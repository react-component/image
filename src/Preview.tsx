import * as React from 'react';
import Dialog from 'rc-dialog';
import IDialogPropTypes from 'rc-dialog/lib/IDialogPropTypes';
import RotateLeftOutlined from '@ant-design/icons/RotateLeftOutlined';
import RotateRightOutlined from '@ant-design/icons/RotateRightOutlined';
import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined';
import ZoomOutOutlined from '@ant-design/icons/ZoomOutOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import classnames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { getOffset } from 'rc-util/lib/Dom/css';
import useFrameSetState from './hooks/useFrameSetState';
import getFixScaleEleTransPosition from './getFixScaleEleTransPosition';

const { useState } = React;

interface PreviewProps extends Omit<IDialogPropTypes, 'onClose'> {
  onClose?: (e: React.SyntheticEvent<HTMLDivElement | HTMLLIElement>) => any;
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
  const refState = React.useRef<{
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
  const [isGrabing, setIsGrabing] = React.useState(false);

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

  const wrapClassName = classnames({
    [`${prefixCls}-grabing`]: isGrabing,
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
    if (visible && isGrabing) {
      const width = imgRef.current.offsetWidth * scale;
      const height = imgRef.current.offsetHeight * scale;
      const { left, top } = getOffset(imgRef.current);
      const isRotate = rotate % 180 !== 0;

      setIsGrabing(false);

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
    refState.current.deltaX = event.pageX - position.x;
    refState.current.deltaY = event.pageY - position.y;
    refState.current.originX = position.x;
    refState.current.originY = position.y;
    setIsGrabing(true);
  };

  const onMouseMove: React.MouseEventHandler<HTMLBodyElement> = event => {
    if (visible && isGrabing) {
      setPosition({
        x: event.pageX - refState.current.deltaX,
        y: event.pageY - refState.current.deltaY,
      });
    }
  };

  React.useEffect(() => {
    let onTopMouseUpListener;
    let onTopMouseMoveListener;

    const onMouseUpListener = addEventListener(window, 'mouseup', onMouseUp, false);
    const onMouseMoveListener = addEventListener(window, 'mousemove', onMouseMove, false);

    // Resolve if in iframe lost event
    /* istanbul ignore next */
    if (window.top !== window.self) {
      onTopMouseUpListener = addEventListener(window.top, 'mouseup', onMouseUp, false);
      onTopMouseMoveListener = addEventListener(window.top, 'mousemove', onMouseMove, false);
    }

    return () => {
      onMouseUpListener.remove();
      onMouseMoveListener.remove();

      /* istanbul ignore next */
      if (onTopMouseUpListener) onTopMouseUpListener.remove();
      /* istanbul ignore next */
      if (onTopMouseMoveListener) onTopMouseMoveListener.remove();
    };
  }, [visible, isGrabing]);

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
          src={src}
          alt={alt}
          style={{
            transform: `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`,
          }}
        />
      </div>
    </Dialog>
  );
};

export default Preview;
