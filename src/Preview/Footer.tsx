import classNames from 'classnames';
import * as React from 'react';
import type { Actions, PreviewProps } from '.';

export interface FooterProps extends Actions {
  prefixCls: string;
  showProgress: boolean;
  countRender?: PreviewProps['countRender'];
  actionsRender?: PreviewProps['actionsRender'];
  current: number;
  count: number;
  showSwitch: boolean;
}

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

export default function Footer(props: FooterProps) {
  const { prefixCls, showProgress, countRender, current, count, showSwitch, onActive } = props;

  // ========================== Render ==========================
  // >>>>> Progress
  const progressNode = showProgress && (
    <div className={`${prefixCls}-progress`}>
      {countRender ? countRender(current + 1, count) : `${current + 1} / ${count}`}
    </div>
  );

  // >>>>> Actions
  const actionCls = `${prefixCls}-actions-operation`;

  const renderOperation = ({ type, disabled, onClick, icon }: RenderOperationParams) => {
    return (
      <div
        key={type}
        className={classNames(actionCls, `${actionCls}-${type}`, {
          [`${actionCls}-disabled`]: !!disabled,
        })}
        onClick={onClick}
      >
        {icon}
      </div>
    );
  };

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

  const actionsNode = (
    <div
      className={classNames(`${prefixCls}-operations`, imageClassNames?.actions)}
      style={styles?.actions}
    >
      {flipYNode}
      {flipXNode}
      {rotateLeftNode}
      {rotateRightNode}
      {zoomOutNode}
      {zoomInNode}
    </div>
  );

  return (
    <div className={`${prefixCls}-footer`}>
      {progressNode}
      {actionsNode}
    </div>
  );
}
