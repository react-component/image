import Portal from '@rc-component/portal';
import classnames from 'classnames';
import CSSMotion from 'rc-motion';
import KeyCode from 'rc-util/lib/KeyCode';
import * as React from 'react';
import { useContext } from 'react';
import type { ImgInfo } from './Image';
import type { PreviewProps, ToolbarRenderInfoType } from './Preview';
import { PreviewGroupContext } from './context';
import type { TransformType } from './hooks/useImageTransform';

type OperationType =
  | 'prev'
  | 'next'
  | 'flipY'
  | 'flipX'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomOut'
  | 'zoomIn';

interface RenderOperationParams {
  icon: React.ReactNode;
  type: OperationType;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

interface OperationsProps
  extends Pick<
    PreviewProps,
    | 'visible'
    | 'maskTransitionName'
    | 'getContainer'
    | 'prefixCls'
    | 'rootClassName'
    | 'icons'
    | 'countRender'
    | 'closeIcon'
    | 'onClose'
  > {
  showSwitch: boolean;
  showProgress: boolean;
  current: number;
  transform: TransformType;
  count: number;
  scale: number;
  minScale: number;
  maxScale: number;
  onActive: (offset: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateRight: () => void;
  onRotateLeft: () => void;
  onFlipX: () => void;
  onFlipY: () => void;
  onReset: () => void;
  toolbarRender: (
    originalNode: React.ReactElement,
    info: ToolbarRenderInfoType | Omit<ToolbarRenderInfoType, 'current' | 'total'>,
  ) => React.ReactNode;
  zIndex?: number;
  image?: ImgInfo;
}

const Operations: React.FC<OperationsProps> = props => {
  const {
    visible,
    maskTransitionName,
    getContainer,
    prefixCls,
    rootClassName,
    icons,
    countRender,
    showSwitch,
    showProgress,
    current,
    transform,
    count,
    scale,
    minScale,
    maxScale,
    closeIcon,
    onActive,
    onClose,
    onZoomIn,
    onZoomOut,
    onRotateRight,
    onRotateLeft,
    onFlipX,
    onFlipY,
    onReset,
    toolbarRender,
    zIndex,
    image,
  } = props;
  const groupContext = useContext(PreviewGroupContext);
  const { rotateLeft, rotateRight, zoomIn, zoomOut, close, left, right, flipX, flipY } = icons;
  const toolClassName = `${prefixCls}-operations-operation`;

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.ESC) {
        onClose();
      }
    };

    if (visible) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [visible]);

  const handleActive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, offset: number) => {
    e.preventDefault();
    e.stopPropagation();

    onActive(offset);
  };

  const renderOperation = React.useCallback(
    ({ type, disabled, onClick, icon }: RenderOperationParams) => {
      return (
        <div
          key={type}
          className={classnames(toolClassName, `${prefixCls}-operations-operation-${type}`, {
            [`${prefixCls}-operations-operation-disabled`]: !!disabled,
          })}
          onClick={onClick}
        >
          {icon}
        </div>
      );
    },
    [toolClassName, prefixCls],
  );

  const switchPrevNode = showSwitch
    ? renderOperation({
        icon: left,
        onClick: e => handleActive(e, -1),
        type: 'prev',
        disabled: current === 0,
      })
    : undefined;

  const switchNextNode = showSwitch
    ? renderOperation({
        icon: right,
        onClick: e => handleActive(e, 1),
        type: 'next',
        disabled: current === count - 1,
      })
    : undefined;

  const flipYNode = renderOperation({
    icon: flipY,
    onClick: onFlipY,
    type: 'flipY',
  });

  const flipXNode = renderOperation({
    icon: flipX,
    onClick: onFlipX,
    type: 'flipX',
  });

  const rotateLeftNode = renderOperation({
    icon: rotateLeft,
    onClick: onRotateLeft,
    type: 'rotateLeft',
  });

  const rotateRightNode = renderOperation({
    icon: rotateRight,
    onClick: onRotateRight,
    type: 'rotateRight',
  });

  const zoomOutNode = renderOperation({
    icon: zoomOut,
    onClick: onZoomOut,
    type: 'zoomOut',
    disabled: scale <= minScale,
  });

  const zoomInNode = renderOperation({
    icon: zoomIn,
    onClick: onZoomIn,
    type: 'zoomIn',
    disabled: scale === maxScale,
  });

  const toolbarNode = (
    <div className={`${prefixCls}-operations`}>
      {flipYNode}
      {flipXNode}
      {rotateLeftNode}
      {rotateRightNode}
      {zoomOutNode}
      {zoomInNode}
    </div>
  );

  return (
    <CSSMotion visible={visible} motionName={maskTransitionName}>
      {({ className, style }) => (
        <Portal open getContainer={getContainer ?? document.body}>
          <div
            className={classnames(`${prefixCls}-operations-wrapper`, className, rootClassName)}
            style={{
              ...style,
              zIndex,
            }}
          >
            {closeIcon === null ? null : (
              <button className={`${prefixCls}-close`} onClick={onClose}>
                {closeIcon || close}
              </button>
            )}

            {showSwitch && (
              <>
                <div
                  className={classnames(`${prefixCls}-switch-left`, {
                    [`${prefixCls}-switch-left-disabled`]: current === 0,
                  })}
                  onClick={e => handleActive(e, -1)}
                >
                  {left}
                </div>
                <div
                  className={classnames(`${prefixCls}-switch-right`, {
                    [`${prefixCls}-switch-right-disabled`]: current === count - 1,
                  })}
                  onClick={e => handleActive(e, 1)}
                >
                  {right}
                </div>
              </>
            )}

            <div className={`${prefixCls}-footer`}>
              {showProgress && (
                <div className={`${prefixCls}-progress`}>
                  {countRender ? countRender(current + 1, count) : `${current + 1} / ${count}`}
                </div>
              )}

              {toolbarRender
                ? toolbarRender(toolbarNode, {
                    icons: {
                      prevIcon: switchPrevNode,
                      nextIcon: switchNextNode,
                      flipYIcon: flipYNode,
                      flipXIcon: flipXNode,
                      rotateLeftIcon: rotateLeftNode,
                      rotateRightIcon: rotateRightNode,
                      zoomOutIcon: zoomOutNode,
                      zoomInIcon: zoomInNode,
                    },
                    actions: {
                      onActive,
                      onFlipY,
                      onFlipX,
                      onRotateLeft,
                      onRotateRight,
                      onZoomOut,
                      onZoomIn,
                      onReset,
                      onClose,
                    },
                    transform,
                    ...(groupContext ? { current, total: count } : {}),
                    image,
                  })
                : toolbarNode}
            </div>
          </div>
        </Portal>
      )}
    </CSSMotion>
  );
};

export default Operations;
