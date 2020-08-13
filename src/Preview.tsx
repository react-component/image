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
import useSetState from './hooks/useSetState';
import useFrameSetState from './hooks/useFrameSetState';
import getFixScaleEleTransPosition from './getFixScaleEleTransPosition';

interface PreviewProps extends Omit<IDialogPropTypes, 'onClose'> {
  onClose?: (e: React.SyntheticEvent<HTMLDivElement | HTMLLIElement>) => any;
  src?: string;
  alt?: string;
}

interface PreviewState {
  scale: number;
  rotate: number;
}

const initialState = {
  scale: 1,
  rotate: 0,
};

const initialFrameState = {
  x: 0,
  y: 0,
};

const Preview: React.FC<PreviewProps> = props => {
  const { prefixCls, src, alt, onClose, afterClose, visible, ...restProps } = props;
  const [state, setSatte] = useSetState<PreviewState>(initialState);
  const [frameState, setFrameState] = useFrameSetState<{
    x: number;
    y: number;
  }>(initialFrameState);
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
    setSatte(initialState);
    setFrameState(initialFrameState);
  };

  const onZoomIn = () => {
    setSatte(({ scale }) => ({
      scale: scale + 1,
    }));
    setFrameState(initialFrameState);
  };
  const onZoomOut = () => {
    if (state.scale > 1) {
      setSatte({ scale: state.scale - 1 });
    }
    setFrameState(initialFrameState);
  };

  const onRotateRight = () => {
    setSatte(({ rotate }) => ({
      rotate: rotate + 90,
    }));
  };
  const onRotateLeft = () => {
    setSatte(({ rotate }) => ({
      rotate: rotate - 90,
    }));
  };

  const wrapClassName = classnames({
    [`${prefixCls}-grabing`]: isGrabing,
  });
  const toolClassName = `${prefixCls}-tools-tool`;
  const iconClassName = `${prefixCls}-tools-icon`;
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
      disabled: state.scale === 1,
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
      const width = imgRef.current.offsetWidth * state.scale;
      const height = imgRef.current.offsetHeight * state.scale;
      const { left, top } = getOffset(imgRef.current);
      const isRotate = state.rotate % 180 !== 0;

      setIsGrabing(false);

      const fixState = getFixScaleEleTransPosition(
        isRotate ? height : width,
        isRotate ? width : height,
        left,
        top,
      );

      if (fixState) {
        setFrameState({ ...fixState });
      }
    }
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
    // Without this mask close will abnormal
    event.stopPropagation();
    refState.current.deltaX = event.pageX - frameState.x;
    refState.current.deltaY = event.pageY - frameState.y;
    refState.current.originX = frameState.x;
    refState.current.originY = frameState.y;
    setIsGrabing(true);
  };

  const onMouseMove: React.MouseEventHandler<HTMLBodyElement> = event => {
    if (visible && isGrabing) {
      setFrameState({
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
      <ul className={`${prefixCls}-tools`}>
        {tools.map(({ Icon, onClick, type, disabled }) => (
          <li
            className={classnames(toolClassName, {
              [`${prefixCls}-tools-tool-disabled`]: !!disabled,
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
          transform: `translate3d(${frameState.x}px, ${frameState.y}px, 0)`,
        }}
      >
        <img
          onMouseDown={onMouseDown}
          ref={imgRef}
          className={`${prefixCls}-img`}
          src={src}
          alt={alt}
          style={{
            transform: `scale3d(${state.scale}, ${state.scale}, 1) rotate(${state.rotate}deg)`,
          }}
        />
      </div>
    </Dialog>
  );
};

export default Preview;
