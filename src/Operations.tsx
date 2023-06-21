import Portal from '@rc-component/portal';
import classnames from 'classnames';
import CSSMotion from 'rc-motion';
import * as React from 'react';
import { useContext } from 'react';
import { PreviewGroupContext } from './context';
import type { TransformType } from './hooks/useImageTransform';
import type { PreviewProps, ToolbarRenderInfoType } from './Preview';

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
  onSwitchLeft: React.MouseEventHandler<HTMLDivElement>;
  onSwitchRight: React.MouseEventHandler<HTMLDivElement>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateRight: () => void;
  onRotateLeft: () => void;
  onFlipX: () => void;
  onFlipY: () => void;
  toolbarRender: (
    originalNode: React.ReactNode,
    info: ToolbarRenderInfoType | Omit<ToolbarRenderInfoType, 'current' | 'total'>,
  ) => React.ReactNode;
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
    onSwitchLeft,
    onSwitchRight,
    onClose,
    onZoomIn,
    onZoomOut,
    onRotateRight,
    onRotateLeft,
    onFlipX,
    onFlipY,
    toolbarRender,
  } = props;
  const groupContext = useContext(PreviewGroupContext);
  const { rotateLeft, rotateRight, zoomIn, zoomOut, close, left, right, flipX, flipY } = icons;
  const toolClassName = `${prefixCls}-operations-operation`;
  const iconClassName = `${prefixCls}-operations-icon`;
  const tools = [
    {
      icon: flipY,
      onClick: onFlipY,
      type: 'flipY',
    },
    {
      icon: flipX,
      onClick: onFlipX,
      type: 'flipX',
    },
    {
      icon: rotateLeft,
      onClick: onRotateLeft,
      type: 'rotateLeft',
    },
    {
      icon: rotateRight,
      onClick: onRotateRight,
      type: 'rotateRight',
    },
    {
      icon: zoomOut,
      onClick: onZoomOut,
      type: 'zoomOut',
      disabled: scale === minScale,
    },
    {
      icon: zoomIn,
      onClick: onZoomIn,
      type: 'zoomIn',
      disabled: scale === maxScale,
    },
    {
      icon: close,
      onClick: onClose,
      type: 'close',
    },
  ];

  const toolsNode = tools.map(({ icon, onClick, type, disabled }) => (
    <li
      className={classnames(toolClassName, {
        [`${prefixCls}-operations-operation-${type}`]: true,
        [`${prefixCls}-operations-operation-disabled`]: !!disabled,
      })}
      onClick={onClick}
      key={type}
    >
      {React.isValidElement(icon)
        ? React.cloneElement<{ className?: string }>(icon, { className: iconClassName })
        : icon}
    </li>
  ));

  const toolbarNode = (
    <ul className={`${prefixCls}-operations`}>
      {showProgress && (
        <li className={`${prefixCls}-operations-progress`}>
          {countRender?.(current + 1, count) ?? `${current + 1} / ${count}`}
        </li>
      )}
      {toolsNode}
    </ul>
  );

  const operations = (
    <>
      {showSwitch && (
        <>
          <div
            className={classnames(`${prefixCls}-switch-left`, {
              [`${prefixCls}-switch-left-disabled`]: current === 0,
            })}
            onClick={onSwitchLeft}
          >
            {left}
          </div>
          <div
            className={classnames(`${prefixCls}-switch-right`, {
              [`${prefixCls}-switch-right-disabled`]: current === count - 1,
            })}
            onClick={onSwitchRight}
          >
            {right}
          </div>
        </>
      )}
      {toolbarRender
        ? toolbarRender(toolbarNode, {
            icons: {
              flipYIcon: toolsNode[0],
              flipXIcon: toolsNode[1],
              rotateLeftIcon: toolsNode[2],
              rotateRightIcon: toolsNode[3],
              zoomOutIcon: toolsNode[4],
              zoomInIcon: toolsNode[5],
              closeIcon: toolsNode[6],
            },
            actions: {
              onFlipY,
              onFlipX,
              onRotateLeft,
              onRotateRight,
              onZoomOut,
              onZoomIn,
              onClose,
            },
            transform,
            ...(groupContext ? { current, total: count } : {}),
          })
        : toolbarNode}
    </>
  );

  return (
    <CSSMotion visible={visible} motionName={maskTransitionName}>
      {({ className, style }) => (
        <Portal open getContainer={getContainer ?? document.body}>
          <div
            className={classnames(`${prefixCls}-operations-wrapper`, className, rootClassName)}
            style={style}
          >
            {operations}
          </div>
        </Portal>
      )}
    </CSSMotion>
  );
};

export default Operations;
